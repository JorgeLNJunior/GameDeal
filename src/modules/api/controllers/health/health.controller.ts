import type { HttpController } from '@localtypes/http/http.controller.type'
import type { HttpResponse } from '@localtypes/http/http.type'
import { HttpMethod } from '@localtypes/http/http.type'
import { ResponseBuilder } from '@modules/api/responses/response.builder'

export class HealthController implements HttpController {
  public method = HttpMethod.HEAD
  public url = '/health'

  handle (): HttpResponse | Promise<HttpResponse> {
    return ResponseBuilder.ok()
  }
}
