import { HttpRequest, HttpResponse } from './http.interface'

export interface BaseController {
  /** The route HTTP method. */
  method: string
  /** The route url. */
  url: string

  /**
   * Handle a server route.
   * @param request A `HttpRequest` object.
   */
  handle(request: HttpRequest): HttpResponse | Promise<HttpResponse>
}
