import { ResponseBuilder } from '@api/responses/response.builder'
import { PINO_LOGGER, REDIS_CACHE } from '@dependencies/dependency.tokens'
import { ApplicationCache } from '@localtypes/http/cache.type'
import { type HttpController } from '@localtypes/http/http.controller.type'
import {
  HttpMethod,
  type HttpRequest,
  type HttpResponse
} from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { FindGameByIdRepository } from '@shared/findGameById.repository'
import { inject, injectable } from 'tsyringe'

@injectable()
export class FindGameByIdController implements HttpController {
  public method = HttpMethod.GET
  public url = '/games/:id'

  constructor (
    private readonly repository: FindGameByIdRepository,
    @inject(REDIS_CACHE) private readonly cacheService: ApplicationCache,
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

      const game = await this.repository.find(request.params.id)
      if (game == null) return ResponseBuilder.notFound('game not found')

      await this.cacheService.set(request.url, game)
      return ResponseBuilder.ok(game)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
