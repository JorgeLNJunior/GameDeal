import { PINO_LOGGER } from '@dependencies/dependency.tokens'
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
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const game = await this.repository.find(request.params.id)
      if (!game) return ResponseBuilder.notFound('game not found')

      return ResponseBuilder.ok(game)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
