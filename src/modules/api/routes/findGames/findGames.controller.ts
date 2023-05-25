import { PINO_LOGGER, REDIS_CACHE } from '@dependencies/dependency.tokens'
import { ApplicationCache } from '@localtypes/http/cache.type'
import { HttpController } from '@localtypes/http/http.controller.type'
import {
  HttpMethod,
  HttpRequest,
  HttpResponse
} from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { ResponseBuilder } from '@modules/api/responses/response.builder'
import { inject, injectable } from 'tsyringe'

import { FindGamesRepository } from './repositories/findGames.repository'

@injectable()
export class FindGamesController implements HttpController {
  public method = HttpMethod.GET
  public url = '/games'

  constructor(
    private findGamesRepository: FindGamesRepository,
    @inject(REDIS_CACHE) private cacheService: ApplicationCache,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const cache = await this.cacheService.get(request.url)
      if (cache) {
        const headers = {
          'cache-control': `max-age=${cache.expires}`
        }
        return ResponseBuilder.notModified(cache.value, headers)
      }

      const games = await this.findGamesRepository.find(request.query)
      this.cacheService.set(request.url, games)
      return ResponseBuilder.ok(games)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
