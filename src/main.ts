import 'reflect-metadata'

import { container, injectable } from 'tsyringe'

import { DatabaseService } from './database/database.service'
import { AddGameController } from './http/modules/game/addGame.controller'
import { Server } from './http/server'
import { Logger } from './infra/logger'

@injectable()
export default class Main {
  constructor(
    private dbService: DatabaseService,
    private logger: Logger,
    private server: Server
  ) {}

  async start() {
    this.server.registerControllers(container.resolve(AddGameController))

    await this.dbService.connect()
    await this.server.listen()

    // graceful shutdown
    process.on('SIGINT', async () => {
      this.logger.info('received SIGINT signal')

      this.logger.info('disconnecting from the database')
      await this.dbService.disconnect()
      this.logger.info('disconnected from the database')

      this.logger.info('closing the server')
      await this.server.close()
      this.logger.info('server closed')

      process.exit(0)
    })
  }
}

container.resolve(Main).start()
