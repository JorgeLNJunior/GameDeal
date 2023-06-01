import { AuthService } from '@api/internal/auth.service'
import { ResponseBuilder } from '@api/responses/response.builder'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import type { HttpController } from '@localtypes/http/http.controller.type'
import type {
  HttpRequest,
  HttpResponse
} from '@localtypes/http/http.type'
import { HttpMethod } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
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

      const token = authToken.replace('Bearer ', '')
      const tokenValidation = await this.authService.verifyToken(token)
      if (!tokenValidation.isValid) {
        return ResponseBuilder.unauthorized(tokenValidation.error)
      }

      const { success, errors } = this.validator.validate(request.body)
      if (!success) return ResponseBuilder.badRequest(errors)

      const isAlreadyInserted = await this.isGameAlreadyInsertedRepository
        .handle(request.body.title)

      if (isAlreadyInserted) {
        return ResponseBuilder.badRequest({
          validation: 'unique',
          code: 'game_already_insert',
          message: 'Invalid',
          path: ['title']
        })
      }

      const game = await this.addGameRepository.add(request.body)

      return ResponseBuilder.created(game)
    } catch (error) {
      this.logger.error(error, '[AddGameController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
