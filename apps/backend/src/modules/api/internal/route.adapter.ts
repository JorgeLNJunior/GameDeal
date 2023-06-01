/* eslint-disable @typescript-eslint/no-explicit-any */
import { type HttpController } from '@localtypes/http/http.controller.type'
import { type HttpRequest } from '@localtypes/http/http.type'
import { type FastifyReply, type FastifyRequest, type RouteHandler } from 'fastify'

/**
 * Adapt an application route to a fastify route.
 *
 * ```
 * fastify.route({
 * url: controller.url,
 * method: controller.method as never,
 * handler: adaptRoute(controller)
 * })
 * ```
 * @param controller - A class wich implements `HttpController`.
 * @returns A fastify `RouteHandler`
 */
export function adaptRoute (controller: HttpController): RouteHandler {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const request: HttpRequest = {
      body: req.body,
      params: req.params as any,
      headers: req.headers as any,
      query: req.query as any,
      url: req.url
    }
    const response = await controller.handle(request)

    return await res
      .status(response.statusCode)
      .headers(response.headers ?? {})
      .send(response.body)
  }
}
