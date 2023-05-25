import { ResponseBuilder } from '@api/responses/response.builder'
import { PINO_LOGGER, REDIS_CACHE } from '@dependencies/dependency.tokens'
import { ApplicationCache } from '@localtypes/http/cache.type'
import { HttpController } from '@localtypes/http/http.controller.type'
import {
  HttpMethod,
  HttpRequest,
  HttpResponse
} from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { inject, injectable } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { GetLowestHistoricalPriceRepository } from './repositories/getLowestHistoricalPrice.repository'

@injectable()
export class GetLowestHistoricalPriceController implements HttpController {
  public method = HttpMethod.GET
  public url = '/games/:id/price/historical'

  constructor(
    private readonly getLowestPriceRepo: GetLowestHistoricalPriceRepository,
    private readonly isGameExistRepo: IsGameExistRepository,
    @inject(REDIS_CACHE) private cacheService: ApplicationCache,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const noCache =
        request.headers['cache-control'] &&
        request.headers['cache-control'].includes('no-cache')
      if (!noCache) {
        const cache = await this.cacheService.get(request.url)
        if (cache) {
          const headers = {
            'Cache-Control': `max-age=${cache.expires}`
          }
          return ResponseBuilder.notModified(cache.value, headers)
        }
      }

      const isGameExist = await this.isGameExistRepo.get(request.params.id)
      if (!isGameExist) return ResponseBuilder.notFound('game not found')

      const price = await this.getLowestPriceRepo.get(request.params.id)
      this.cacheService.set(request.url, price, 60 * 5)
      return ResponseBuilder.ok(price)
    } catch (error) {
      this.logger.error(
        error,
        '[GetLowestHistoricalPriceController] internal server error'
      )
      return ResponseBuilder.internalError()
    }
  }
}
