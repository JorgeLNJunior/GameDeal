/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest, RouteHandler } from 'fastify'

import { BaseController } from '../../types/http/baseController.type'
import { HttpRequest } from '../../types/http/http.type'

/**
 * Adapt an application route to a fastify route.
 *
 * ```
 * fastify.route({
 *  url: controller.url,
 *  method: controller.method as never,
 *  handler: adaptRoute(controller)
 * })
 * ```
 *
 * @param {BaseController} controller A class wich implements `BaseController`.
 * @returns {RouteHandler} A fastify `RouteHandler`
 */
export function adaptRoute(controller: BaseController): RouteHandler {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const request: HttpRequest = {
      body: req.body,
      params: req.params as any,
      headers: req.headers as any,
      query: req.query as any
    }
    const response = await controller.handle(request)

    return res.status(response.statusCode).send(response.body)
  }
}
