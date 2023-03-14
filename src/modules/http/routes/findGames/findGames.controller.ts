import { ResponseBuilder } from '@http/responses/response.builder'
import { BaseController } from '@localtypes/http/baseController.type'
import { HttpResponse } from '@localtypes/http/http.type'
import { injectable } from 'tsyringe'

import { FindGamesRepository } from './repositories/findGames.repository'

@injectable()
export class FindGamesController implements BaseController {
  public method = 'GET'
  public url = '/games'

  constructor(private findGamesRepository: FindGamesRepository) {}

  async handle(): Promise<HttpResponse> {
    const games = await this.findGamesRepository.find()
    return ResponseBuilder.ok(games)
  }
}
