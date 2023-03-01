import { injectable } from 'tsyringe'

import { BaseController } from '../../../../types/http/baseController.type'
import { HttpRequest, HttpResponse } from '../../../../types/http/http.type'
import { GameRepository } from '../../../database/repositories/game.repository'
import { ResponseBuilder } from '../../responses/response.builder'

@injectable()
export class GetGamePriceController implements BaseController {
  method = 'GET'
  url = '/games/:id/price'

  constructor(private gameRepository: GameRepository) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const isGameExists = await this.gameRepository.findById(request.params.id)
    if (!isGameExists) return ResponseBuilder.notFound('Game not found')

    const price = await this.gameRepository.getPrice(request.params.id)
    return ResponseBuilder.ok(price)
  }
}
