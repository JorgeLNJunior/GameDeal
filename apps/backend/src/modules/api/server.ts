import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import type { HttpController } from '@localtypes/http/http.controller.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { fastify, type FastifyInstance } from 'fastify'
import { join } from 'path'
import { inject, singleton } from 'tsyringe'

import { adaptRoute } from './internal/route.adapter'

@singleton()
export class Server {
  private readonly fastify: FastifyInstance

  constructor (
    private readonly config: ConfigService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {
    this.fastify = fastify()
  }

  /**
   * Starts the server and listen at `PORT` env or `3000`.
   * @example
   * ```
   * await server.listen()
   * ```
   */
  public async listen (): Promise<void> {
    this.logger.info('[Server] starting the server')
    this.fastify.listen(
      {
        host: this.config.getEnv<string>('HOST') ?? '0.0.0.0',
        port: this.config.getEnv<number>('PORT') ?? 3000
      },
      (error) => {
        if (error !== null) this.logger.fatal(error, '[Server] server startup error')
        else this.logger.info('[Server] the server is listening')
      }
    )
  }

  /**
   * Closes the server and stops listening.
   * @example
   * ```
   * await server.close()
   * ```
   */
  public async close (): Promise<void> {
    this.logger.info('[Server] closing the server')
    await this.fastify.close()
    this.logger.info('[Server] the server has been closed')
  }

  /**
   * Gets the fastify instance.
   * @example
   * ```
   * const fastify = server.getFastifyInstance()
   * ```
   * @returns A fastify instance.
   */
  public getFastifyInstance (): FastifyInstance {
    return this.fastify
  }

  /**
   * Registers a list of controllers.
   * @example
   * ```
   * server.registerControllers(
   *    new CatController(),
   *    new DogController(),
   * )
   * ```
   * @param controllers - A list of `HttpController`.
   */
  public registerControllers (...controllers: HttpController[]): void {
    this.logger.info('[Server] registering all controllers')
    controllers.forEach((controller) => {
      this.fastify.route({
        url: controller.url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        method: controller.method as any,
        handler: adaptRoute(controller)
      })
    })
    this.logger.info('[Server] all controllers registered')
  }

  /**
   * Registers fastify plugins.
   * @example
   * ```
   * await this.registerPlugins()
   * ```
   */
  public async registerPlugins (): Promise<void> {
    this.logger.info('[Server] registering all plugins')
    await this.fastify.register(import('@fastify/compress'))
    await this.fastify.register(import('@fastify/cors'))
    await this.fastify.register(import('@fastify/helmet'))
    await this.fastify.register(import('@fastify/rate-limit'), {
      max: 300,
      timeWindow: '1 minute'
    })
    await this.fastify.register(import('@fastify/swagger'), {
      mode: 'static',
      specification: {
        path: join(__dirname, '/docs/swagger.yaml'),
        baseDir: ''
      }
    })
    await this.fastify.register(import('@fastify/swagger-ui'), {
      routePrefix: '/docs'
    })
    this.logger.info('[Server] all plugins registered')
  }
}
