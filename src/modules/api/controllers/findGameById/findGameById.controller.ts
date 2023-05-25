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
import { inject, injectable } from 'tsyringe'

@injectable()
export class FindGameByIdController implements HttpController {
  public method = HttpMethod.GET
  public url = '/games/:id'

  constructor(
    private repository: FindGameByIdRepository,
    @inject(REDIS_CACHE) private cacheService: ApplicationCache,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const cache = await this.cacheService.get(request.url)
      if (cache) {
        const headers = {
          'Cache-Control': `max-age=${cache.expires}`
        }
        return ResponseBuilder.notModified(cache.value, headers)
      }

      const game = await this.repository.find(request.params.id)
      if (!game) return ResponseBuilder.notFound('game not found')

      this.cacheService.set(request.url, game)
      return ResponseBuilder.ok(game)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
