import type { AddGameDTO } from '@api/controllers/addGame/dto/addGame.dto'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import type { HttpController } from '@localtypes/http/http.controller.type'
import type {
  HttpRequest,
  HttpResponse
} from '@localtypes/http/http.type'
import { HttpMethod } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { ResponseBuilder } from '@modules/api/responses/response.builder'
import { AuthService } from '@shared/services/auth.service'
import { inject, injectable } from 'tsyringe'

import { AddGameRepository } from './repositories/addGame.repository'
import { IsGameAlreadyInsertedRepository } from './repositories/isGameAlreadyInserted.repository'
import { AddGameValidator } from './validator/addGame.validator'

@injectable()
export class AddGameController implements HttpController {
  method = HttpMethod.POST
  url = '/games'

  constructor (
    private readonly validator: AddGameValidator,
    private readonly addGameRepository: AddGameRepository,
    private readonly isGameAlreadyInsertedRepository: IsGameAlreadyInsertedRepository,
    private readonly authService: AuthService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const authToken = request.headers.authorization
      if (authToken == null) {
        return ResponseBuilder.unauthorized('auth token not provided')
      }

      const tokenValidation = await this.authService.verifyToken(
        authToken.replace('Bearer ', '')
      )
      if (!tokenValidation.isValid) {
        return ResponseBuilder.unauthorized(tokenValidation.error)
      }

      const { success, errors } = this.validator.validate(request.body)
      if (!success) return ResponseBuilder.badRequest(errors)

      const isAlreadyInserted =
        await this.isGameAlreadyInsertedRepository.handle(
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

      const game = await this.addGameRepository.add(request.body as AddGameDTO)

      return ResponseBuilder.created(game)
    } catch (error) {
      this.logger.error(error, '[AddGameController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
