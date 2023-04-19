import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { BaseController } from '@localtypes/http/baseController.type'
import { HttpResponse } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { ResponseBuilder } from '@modules/api/responses/response.builder'
import { inject, injectable } from 'tsyringe'

import { FindGamesRepository } from './repositories/findGames.repository'

@injectable()
export class FindGamesController implements BaseController {
  public method = 'GET'
  public url = '/games'

  constructor(
    private findGamesRepository: FindGamesRepository,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async handle(): Promise<HttpResponse> {
    try {
      const games = await this.findGamesRepository.find()
      return ResponseBuilder.ok(games)
    } catch (error) {
      this.logger.error(error, '[FindGameByIdController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
