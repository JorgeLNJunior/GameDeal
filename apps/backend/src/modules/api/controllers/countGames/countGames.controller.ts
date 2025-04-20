import { ResponseBuilder } from '@api/responses/response.builder'
import { MEMORY_CACHE, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationCache } from '@localtypes/http/cache.type'
import { type HttpController } from '@localtypes/http/http.controller.type'
import { HttpMethod, type HttpRequest, type HttpResponse } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { inject, injectable } from 'tsyringe'

import { CountGamesRepository } from './repositories/countGames.repository'

@injectable()
export class CountGamesController implements HttpController {
  constructor (
    private readonly countGamesRepository: CountGamesRepository,
    @inject(MEMORY_CACHE) private readonly cacheService: ApplicationCache,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  public method: HttpMethod = HttpMethod.GET
  public url = '/games/count'

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

      const total = await this.countGamesRepository.count()
      await this.cacheService.set(request.url, { total })

      return ResponseBuilder.ok({ total })
    } catch (error) {
      this.logger.error(error, '[CountGamesController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
