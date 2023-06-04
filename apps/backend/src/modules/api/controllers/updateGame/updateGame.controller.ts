import { AuthService } from '@api/internal/auth.service'
import { ResponseBuilder } from '@api/responses/response.builder'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { type HttpController } from '@localtypes/http/http.controller.type'
import { HttpMethod, type HttpRequest, type HttpResponse } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { inject, injectable } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { UpdateGameRepository } from './repositories/updateGame.repository'
import { UpdateGameValidator } from './validator/updateGame.validator'

@injectable()
export class UpdateGameController implements HttpController {
  public method: HttpMethod = HttpMethod.PATCH
  public url: string = '/games/:id'

  constructor (
    private readonly validator: UpdateGameValidator,
    private readonly authService: AuthService,
    private readonly isGameExistRepo: IsGameExistRepository,
    private readonly updateGameRepo: UpdateGameRepository,
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

      const isGameExist = await this.isGameExistRepo.get(request.params.id)
      if (!isGameExist) return ResponseBuilder.notFound('game not found')

      const game = await this.updateGameRepo.update(request.params.id, request.body)

      return ResponseBuilder.ok(game)
    } catch (error) {
      this.logger.error(error, '[UpdateGameController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
