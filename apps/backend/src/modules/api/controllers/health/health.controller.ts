import { ResponseBuilder } from '@api/responses/response.builder'
import { DatabaseService } from '@database/database.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { type HttpController } from '@localtypes/http/http.controller.type'
import { HttpMethod, type HttpResponse } from '@localtypes/http/http.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { inject, injectable } from 'tsyringe'

@injectable()
export class HealthController implements HttpController {
  constructor (
    private readonly databaseService: DatabaseService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger

  ) { }

  method: HttpMethod = HttpMethod.GET
  url: string = '/healthz'
  async handle (): Promise<HttpResponse> {
    try {
      await this.databaseService.getClient().selectFrom('game').select('id').limit(1).execute()
      return ResponseBuilder.ok({ status: 'ok' })
    } catch (error) {
      this.logger.error(error, '[HealthController] server is unhealthy')
      return ResponseBuilder.serviceUnavailable()
    }
  }
}
