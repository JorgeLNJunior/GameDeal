import { GameRepository } from '@database/repositories/game.repository'
import { ResponseBuilder } from '@http/responses/response.builder'
import { BaseController } from '@localtypes/http/baseController.type'
import { HttpResponse } from '@localtypes/http/http.type'
import { injectable } from 'tsyringe'

@injectable()
export class GetGameController implements BaseController {
  public method = 'GET'
  public url = '/games'

  constructor(private gameRepository: GameRepository) {}

  async handle(): Promise<HttpResponse> {
    const games = await this.gameRepository.find()
    return ResponseBuilder.ok(games)
  }
}
