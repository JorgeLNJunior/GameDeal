import { FastifyReply, FastifyRequest, HTTPMethods } from 'fastify'

export interface BaseController {
  /** The route HTTP method. */
  method: HTTPMethods
  /** The route url. */
  url: string

  /**
   * Handle a server route.
   * @param request A `FastifyRequest` object.
   * @param response A `FastifyReply` object.
   */
  handler(
    request: FastifyRequest,
    response: FastifyReply
  ): unknown | Promise<unknown>
}
