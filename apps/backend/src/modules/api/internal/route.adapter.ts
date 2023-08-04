/* eslint-disable @typescript-eslint/no-explicit-any */
import { type HttpController } from '@localtypes/http/http.controller.type'
import { type HttpRedirect, type HttpRequest, type HttpResponse } from '@localtypes/http/http.type'
import { type FastifyReply, type FastifyRequest, type RouteHandler } from 'fastify'

/**
 * Adapt a http controller to a fastify route.
 *
 * ```
 * fastify.route({
 * url: controller.url,
 * method: controller.method as never,
 * handler: adaptRoute(controller)
 * })
 * ```
 * @param controller - A implementation of `HttpController`.
 * @returns A fastify `RouteHandler`.
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

    if (isRedirect(response)) {
      return await res.redirect(response.statusCode, response.to)
    }

    return await res
      .status(response.statusCode)
      .headers(response.headers ?? {})
      .send(response.body)
  }
}

function isRedirect (res: HttpResponse | HttpRedirect): res is HttpRedirect {
  return 'to' in res
}
