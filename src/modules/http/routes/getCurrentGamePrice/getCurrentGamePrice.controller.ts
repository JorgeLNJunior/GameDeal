import { ResponseBuilder } from '@http/responses/response.builder'
import { BaseController } from '@localtypes/http/baseController.type'
import { HttpRequest, HttpResponse } from '@localtypes/http/http.type'
import { FindGameByIdRepository } from '@modules/shared/repositories/findGameById.repository'
import { injectable } from 'tsyringe'

import { GetCurrentGamePriceRepository } from './repositories/getCurrentGamePrice.repository'

@injectable()
export class GetGamePriceController implements BaseController {
  method = 'GET'
  url = '/games/:id/price'

  constructor(
    private getCurrentGamePriceRepository: GetCurrentGamePriceRepository,
    private findGameByIdRepository: FindGameByIdRepository
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const isGameExists = await this.findGameByIdRepository.find(
      request.params.id
    )
    if (!isGameExists) return ResponseBuilder.notFound('Game not found')

    const price = await this.getCurrentGamePriceRepository.getPrice(
      request.params.id
    )
    return ResponseBuilder.ok(price)
  }
}
