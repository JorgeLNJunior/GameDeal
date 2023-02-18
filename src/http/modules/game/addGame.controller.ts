import { inject, injectable } from 'tsyringe'

import { PINO_LOGGER } from '../../../dependencies/dependency.tokens'
import { ApplicationLogger } from '../../../types/logger.type'
import { BaseController } from '../../interfaces/baseController.interface'
import { HttpRequest, HttpResponse } from '../../interfaces/http.interface'
import { ResponseBuilder } from '../../responses/response.builder'
import { AddGameDTO } from './dto/addGame.dto'
import { GameRepository } from './game.repository'
import { AddGameValidator } from './validators/addGame.validator'

@injectable()
export class AddGameController implements BaseController {
  method = 'POST'
  url = '/games'

  constructor(
    private validator: AddGameValidator,
    private gameRepository: GameRepository,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { success, errors } = this.validator.validate(request.body)
      if (!success) return ResponseBuilder.badRequest(errors)

      const isAlreadyInserted = await this.gameRepository.isAlreadyInserted(
        (request.body as AddGameDTO).title
      )

      if (isAlreadyInserted) {
        return ResponseBuilder.badRequest({
          validation: 'unique',
          code: 'game_already_insert',
          message: 'Invalid',
          path: ['title']
        })
      }

      const game = await this.gameRepository.create(request.body as AddGameDTO)

      return ResponseBuilder.created({ game })
    } catch (error) {
      this.logger.error(error, '[AddGameController] internal error')
      return ResponseBuilder.internalError()
    }
  }
}
