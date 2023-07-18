import { ResponseBuilder } from '@api/responses/response.builder'
import { MEMORY_CACHE, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationCache } from '@localtypes/http/cache.type'
import { type HttpController } from '@localtypes/http/http.controller.type'
import {
  HttpMethod,
  type HttpRequest,
  type HttpResponse
} from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { inject, injectable } from 'tsyringe'

import { FindGamesRepository } from './repositories/findGames.repository'

@injectable()
export class FindGamesController implements HttpController {
  public method = HttpMethod.GET
  public url = '/games'

  constructor (
    private readonly findGamesRepository: FindGamesRepository,
    @inject(MEMORY_CACHE) private readonly cacheService: ApplicationCache,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const noCache = request.headers['cache-control']?.includes('no-cache')
      if (!noCache) {
        const cache = await this.cacheService.get(request.url)
        if (cache != null) {
          const headers = {
            'Cache-Control': `max-age=${cache.expires}`
          }
          return ResponseBuilder.notModified(cache.value, headers)
        }
      }

      const games = await this.findGamesRepository.find(request.query)
      await this.cacheService.set(request.url, games)
      return ResponseBuilder.ok(games)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
