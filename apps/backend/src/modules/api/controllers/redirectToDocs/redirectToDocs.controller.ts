import type { HttpController } from '@localtypes/http/http.controller.type'
import { HttpMethod, type HttpRedirect } from '@localtypes/http/http.type'
import { injectable } from 'tsyringe'

@injectable()
export class RedirectToDocsController implements HttpController {
  public method: HttpMethod = HttpMethod.GET
  public url = '/'

  handle (): HttpRedirect {
    return { statusCode: 303, to: '/docs' }
  }
}
