import { fastify, FastifyInstance } from 'fastify'
import { inject, singleton } from 'tsyringe'

import { PINO_LOGGER } from '../dependencies/dependency.tokens'
import ConfigService from '../services/config.service'
import { BaseController } from '../types/http/baseController.type'
import { ApplicationLogger } from '../types/logger.type'
import { adaptRoute } from './adapters/route.adapter'

@singleton()
export class Server {
  private fastify: FastifyInstance

  constructor(
    private config: ConfigService,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {
    this.fastify = fastify()
  }

  /**
   * Starts the server and listen at `PORT` env or `3000`.
   *
   * @example
   * ```
   * await server.listen()
   * ```
   */
  public async listen(): Promise<void> {
    this.logger.info('[server] starting server')
    await this.registerPlugins()
    return this.fastify.listen(
      {
        host: this.config.getEnv<string>('HOST') || '0.0.0.0',
        port: this.config.getEnv<number>('PORT') || 3000
      },
      (error) => {
        if (error) this.logger.fatal(error, '[Server] server startup error')
        else this.logger.info('[Server] server started')
      }
    )
  }

  /**
   * Closes the server and stops listening.
   *
   * @example
   * ```
   * await server.close()
   * ```
   */
  public async close(): Promise<void> {
    this.logger.info('[Server] closing server')
    await this.fastify.close()
    this.logger.info('[Server] server closed')
  }

  /**
   * Gets the fastify instance.
   *
   * @example
   * ```
   * const fastify = server.getFastifyInstance()
   * ```
   * @returns A fastify instance.
   */
  public getFastifyInstance(): FastifyInstance {
    return this.fastify
  }

  /**
   * Registers a list of controllers.
   *
   * @example
   * ```
   * server.registerControllers(
   *    new CatController(),
   *    new DogController(),
   * )
   * ```
   * @param controllers - A list of `BaseController`.
   */
  public registerControllers(...controllers: BaseController[]): void {
    this.logger.info('[Server] registering controllers')
    controllers.forEach((controller) => {
      this.fastify.route({
        url: controller.url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        method: controller.method as any,
        handler: adaptRoute(controller)
      })
    })
    this.logger.info('[Server] controllers registered')
  }

  /**
   * Registers fastify plugins.
   *
   * @example
   * ```
   * await this.registerPlugins()
   * ```
   */
  private async registerPlugins(): Promise<void> {
    this.logger.info('[Server] registering all plugins')
    await this.fastify.register(import('@fastify/compress'))
    await this.fastify.register(import('@fastify/cors'))
    await this.fastify.register(import('@fastify/helmet'))
    await this.fastify.register(import('@fastify/swagger'), {
      mode: 'static',
      specification: {
        path: __dirname + '/docs/swagger.yaml',
        baseDir: ''
      }
    })
    await this.fastify.register(import('@fastify/swagger-ui'), {
      routePrefix: '/docs'
    })
    this.logger.info('[Server] all plugins registered')
  }
}
