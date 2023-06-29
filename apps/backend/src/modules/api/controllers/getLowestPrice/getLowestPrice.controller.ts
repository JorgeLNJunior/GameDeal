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

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { GetLowestPriceRepository } from './repositories/getLowestPrice.repository'

@injectable()
export class GetLowestPriceController implements HttpController {
  public method = HttpMethod.GET
  public url = '/games/:id/price/lowest'

  constructor (
    private readonly getLowestPriceRepo: GetLowestPriceRepository,
    private readonly isGameExistRepo: IsGameExistRepository,
    @inject(REDIS_CACHE) private readonly cacheService: ApplicationCache,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
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

      const isGameExist = await this.isGameExistRepo.get(request.params.id)
      if (!isGameExist) return ResponseBuilder.notFound('game not found')

      const price = await this.getLowestPriceRepo.get(request.params.id)
      await this.cacheService.set(request.url, price, 60 * 5)
      return ResponseBuilder.ok(price)
    } catch (error) {
      this.logger.error(
        error,
        '[GetLowestPriceController] internal server error'
      )
      return ResponseBuilder.internalError()
    }
  }
}
