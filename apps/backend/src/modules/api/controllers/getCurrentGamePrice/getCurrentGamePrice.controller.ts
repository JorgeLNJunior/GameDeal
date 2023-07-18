import { ResponseBuilder } from '@api/responses/response.builder'
import { MEMORY_CACHE, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationCache } from '@localtypes/http/cache.type'
import type { HttpController } from '@localtypes/http/http.controller.type'
import type {
  HttpRequest,
  HttpResponse
} from '@localtypes/http/http.type'
import { HttpMethod } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { FindGameByIdRepository } from '@shared/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@shared/getCurrentGamePrice.repository'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GetGamePriceController implements HttpController {
  method = HttpMethod.GET
  url = '/games/:id/price'

  constructor (
    private readonly getCurrentGamePriceRepository: GetCurrentGamePriceRepository,
    private readonly findGameByIdRepository: FindGameByIdRepository,
    @inject(MEMORY_CACHE) private readonly cacheService: ApplicationCache,
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

      const isGameExists = await this.findGameByIdRepository.find(
        request.params.id
      )
      if (isGameExists == null) return ResponseBuilder.notFound('Game not found')

      const price = await this.getCurrentGamePriceRepository.getPrice(
        request.params.id
      )
      await this.cacheService.set(request.url, price, 60 * 5)
      return ResponseBuilder.ok(price)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
