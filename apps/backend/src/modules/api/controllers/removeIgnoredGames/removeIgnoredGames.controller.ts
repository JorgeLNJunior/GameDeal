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

import { type RemoveIgnoredGamesDto } from './dto/removeIgnoredGames.dto'
import { RemoveIgnoredGamesRepository } from './repositories/removeIgnoredGames.repository'
import { RemoveIgnoredGamesValidator } from './validator/removeIgnoredGames.validator'

@injectable()
export class RemoveIgnoredGamesController implements HttpController {
  method = HttpMethod.PATCH
  url = '/games/ignore'

  constructor (
    private readonly authService: AuthService,
    private readonly repository: RemoveIgnoredGamesRepository,
    private readonly validator: RemoveIgnoredGamesValidator,
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

      const { success, errors } = await this.validator.validate(request.body)
      if (!success) return ResponseBuilder.badRequest(errors)

      for (const id of (request.body as RemoveIgnoredGamesDto).removeIds) {
        await this.repository.remove(id)
      }

      return ResponseBuilder.ok({
        message: 'the game has been removed from the ignore list'
      })
    } catch (error) {
      this.logger.error(error, '[RemoveIgnoredGamesController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
