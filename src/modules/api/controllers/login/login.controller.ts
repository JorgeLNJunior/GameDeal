import { ResponseBuilder } from '@api/responses/response.builder'
import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { HttpController } from '@localtypes/http/http.controller.type'
import {
  HttpMethod,
  HttpRequest,
  HttpResponse
} from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { AuthService } from '@shared/services/auth.service'
import { inject, injectable } from 'tsyringe'

@injectable()
export class LoginController implements HttpController {
  public method = HttpMethod.POST
  public url = '/login'

  constructor(
    private config: ConfigService,
    private authService: AuthService,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const adminUser = this.config.getEnv<string>('ADMIN_USER')
      const adminPassword = this.config.getEnv<string>('ADMIN_PASSWORD')

      if (
        request.body.user !== adminUser ||
        request.body.password !== adminPassword
      ) {
        return ResponseBuilder.unauthorized('invalid credentials')
      }

      const token = await this.authService.getJwtToken()
      return ResponseBuilder.ok({ token })
    } catch (error) {
      this.logger.error(error, '[LoginController] internal error')
      return ResponseBuilder.internalError()
    }
  }
}
