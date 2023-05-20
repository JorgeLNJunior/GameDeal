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
import { GetCurrentGamePriceRepository } from '@modules/shared/repositories/getCurrentGamePrice.repository'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GetGamePriceController implements HttpController {
  method = HttpMethod.GET
  url = '/games/:id/price'

  constructor(
    private getCurrentGamePriceRepository: GetCurrentGamePriceRepository,
    private findGameByIdRepository: FindGameByIdRepository,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const isGameExists = await this.findGameByIdRepository.find(
        request.params.id
      )
      if (!isGameExists) return ResponseBuilder.notFound('Game not found')

      const price = await this.getCurrentGamePriceRepository.getPrice(
        request.params.id
      )
      return ResponseBuilder.ok(price)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
