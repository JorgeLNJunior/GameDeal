import { HttpMethod, HttpRequest, HttpResponse } from './http.type'

export interface HttpController {
  /** The route HTTP method. */
  method: HttpMethod
  /** The route url. */
  url: string

  /**
   * Handle a server route.
   * @param request - A `HttpRequest` object.
   */
  handle(request: HttpRequest): HttpResponse | Promise<HttpResponse>
}
