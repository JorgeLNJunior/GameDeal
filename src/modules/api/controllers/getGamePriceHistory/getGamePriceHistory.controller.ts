import { ResponseBuilder } from '@api/responses/response.builder'
import { PINO_LOGGER, REDIS_CACHE } from '@dependencies/dependency.tokens'
import { ApplicationCache } from '@localtypes/http/cache.type'
import type { HttpController } from '@localtypes/http/http.controller.type'
import type {
  HttpRequest,
  HttpResponse
} from '@localtypes/http/http.type'
import { HttpMethod } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { inject, injectable } from 'tsyringe'

import { GetGamePriceHistoryRepository } from './repositories/getGamePriceHistory.repository'
import { IsGameExistRepository } from './repositories/isGameExist.repository'

@injectable()
export class GetGamePriceHistoryController implements HttpController {
  public method = HttpMethod.GET
  public url = '/games/:id/price/history'

  constructor (
    private readonly getGamePriceHistoryRepo: GetGamePriceHistoryRepository,
    private readonly isGameExistRepo: IsGameExistRepository,
    @inject(REDIS_CACHE) private readonly cacheService: ApplicationCache,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const gameID = request.params.id
      const query = request.query

      const noCache = request.headers['cache-control']?.includes('no-cache')
      if (!noCache) {
        const cache = await this.cacheService.get(request.url)
        if (cache !== undefined) {
          const headers = {
            'Cache-Control': `max-age=${cache.expires}`
          }
          return ResponseBuilder.notModified(cache.value, headers)
        }
      }

      const isGameExist = await this.isGameExistRepo.get(gameID)
      if (!isGameExist) return ResponseBuilder.notFound('game not found')

      const priceHistory = await this.getGamePriceHistoryRepo.get(gameID, query)
      await this.cacheService.set(request.url, priceHistory, 60 * 5)
      return ResponseBuilder.ok(priceHistory)
    } catch (error) {
      this.logger.error(
        error,
        '[GetGamePriceHistoryController] internal server error'
      )
      return ResponseBuilder.internalError()
    }
  }
}
