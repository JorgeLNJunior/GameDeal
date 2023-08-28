import { ResponseBuilder } from '@api/responses/response.builder'
import { MEMORY_CACHE, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationCache } from '@localtypes/http/cache.type'
import type { HttpController } from '@localtypes/http/http.controller.type'
import type { HttpRequest, HttpResponse } from '@localtypes/http/http.type'
import { HttpMethod } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { inject, injectable } from 'tsyringe'

import { GetPriceDropsRepository } from './repositories/getPriceDrops.repository'

@injectable()
export class GetPriceDropsController implements HttpController {
  public method: HttpMethod = HttpMethod.GET
  public url: string = '/drops'

  constructor (
    private readonly getPriceDropsRepo: GetPriceDropsRepository,
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

      const drops = await this.getPriceDropsRepo.get(request.query)
      await this.cacheService.set(request.url, drops)
      return ResponseBuilder.ok(drops)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
