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

import { IgnoreGamesOnDiscoveryRepository } from './repositories/ignoreGamesOnDiscovery.repository'
import { IgnoreGamesOnDiscoveryValidator } from './validator/ignoreGamesOnDiscovery.validator'

@injectable()
export class IgnoreGamesOnDiscoveryController implements HttpController {
  method = HttpMethod.POST
  url = '/games/ignore'

  constructor (
    private readonly authService: AuthService,
    private readonly repository: IgnoreGamesOnDiscoveryRepository,
    private readonly validator: IgnoreGamesOnDiscoveryValidator,
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

      const data = await this.repository.add(request.body)

      return ResponseBuilder.created(data)
    } catch (error) {
      this.logger.error(error, '[AddGameController] internal server error')
      return ResponseBuilder.internalError()
    }
  }
}
