import { AuthService } from '@api/internal/auth.service'
import { ResponseBuilder } from '@api/responses/response.builder'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { type HttpController } from '@localtypes/http/http.controller.type'
import { HttpMethod, type HttpRequest, type HttpResponse } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { inject, injectable } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { DeleteGameRepository } from './repositories/deleteGame.repository'

@injectable()
export class DeleteGameController implements HttpController {
  public method: HttpMethod = HttpMethod.DELETE
  public url = '/games/:id'

  constructor (
    private readonly authService: AuthService,
    private readonly isGameExistRepo: IsGameExistRepository,
    private readonly deleteGameRepo: DeleteGameRepository,
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

      const isGameExist = await this.isGameExistRepo.get(request.params.id)
      if (!isGameExist) return ResponseBuilder.notFound('game not found')

      await this.deleteGameRepo.delete(request.params.id)

      return ResponseBuilder.ok({ message: 'the game has been deleted' })
    } catch (error) {
      this.logger.error(error, '[DeleteGameController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
