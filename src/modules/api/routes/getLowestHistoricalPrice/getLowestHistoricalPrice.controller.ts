import { ResponseBuilder } from '@api/responses/response.builder'
import { HttpController } from '@localtypes/http/http.controller.type'
import {
  HttpMethod,
  HttpRequest,
  HttpResponse
} from '@localtypes/http/http.type'
import { injectable } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { GetLowestHistoricalPriceRepository } from './repositories/getLowestHistoricalPrice.repository'

@injectable()
export class GetLowestHistoricalPriceController implements HttpController {
  public method = HttpMethod.GET
  public url = '/games/:id/price/historical'

  constructor(
    private readonly getLowestPriceRepo: GetLowestHistoricalPriceRepository,
    private readonly isGameExistRepo: IsGameExistRepository
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const isGameExist = await this.isGameExistRepo.get(request.params.id)
    if (!isGameExist) return ResponseBuilder.notFound('game not found')

    const price = await this.getLowestPriceRepo.get(request.params.id)
    return ResponseBuilder.ok(price)
  }
}
