import { GameRepository } from '@database/repositories/game.repository'
import { ResponseBuilder } from '@http/responses/response.builder'
import { BaseController } from '@localtypes/http/baseController.type'
import { HttpRequest, HttpResponse } from '@localtypes/http/http.type'
import { injectable } from 'tsyringe'

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
