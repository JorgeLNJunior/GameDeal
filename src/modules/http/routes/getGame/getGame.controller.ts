import { injectable } from 'tsyringe'

import { GameRepository } from '../../../../modules/database/repositories/game.repository'
import { BaseController } from '../../../../types/http/baseController.type'
import { HttpResponse } from '../../../../types/http/http.type'
import { ResponseBuilder } from '../../responses/response.builder'

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
