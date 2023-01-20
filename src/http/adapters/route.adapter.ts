/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest, RouteHandler } from 'fastify'

import { BaseController } from '../interfaces/baseController.interface'
import { HttpRequest } from '../interfaces/http.interface'

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
 * @param controller A class wich implements `BaseController`.
 * @returns A fastify `RouteHandler`
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
