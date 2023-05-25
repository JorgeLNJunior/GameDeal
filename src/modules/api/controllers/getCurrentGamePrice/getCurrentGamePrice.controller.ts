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
import { FindGameByIdRepository } from '@modules/shared/repositories/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@modules/shared/repositories/getCurrentGamePrice.repository'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GetGamePriceController implements HttpController {
  method = HttpMethod.GET
  url = '/games/:id/price'

  constructor(
    private getCurrentGamePriceRepository: GetCurrentGamePriceRepository,
    private findGameByIdRepository: FindGameByIdRepository,
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

      const isGameExists = await this.findGameByIdRepository.find(
        request.params.id
      )
      if (!isGameExists) return ResponseBuilder.notFound('Game not found')

      const price = await this.getCurrentGamePriceRepository.getPrice(
        request.params.id
      )
      this.cacheService.set(request.url, price, 60 * 5)
      return ResponseBuilder.ok(price)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
