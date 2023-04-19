import { BaseController } from '@localtypes/http/baseController.type'
import { HttpResponse } from '@localtypes/http/http.type'
import { ResponseBuilder } from '@modules/api/responses/response.builder'

export class HealthController implements BaseController {
  public method = 'HEAD'
  public url = '/health'

  handle(): HttpResponse | Promise<HttpResponse> {
    return ResponseBuilder.ok()
  }
}
