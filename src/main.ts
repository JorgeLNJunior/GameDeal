import 'reflect-metadata'

import { container, injectable } from 'tsyringe'

import { DatabaseService } from './database/database.service'
import { AddGameController } from './http/modules/game/addGame.controller'
import { Server } from './http/server'
import { Browser } from './infra/browser'
import { Logger } from './infra/logger'

@injectable()
export default class Main {
  constructor(
    private server: Server,
    private dbService: DatabaseService,
    private browser: Browser,
    private logger: Logger
  ) {}

  async start() {
    this.server.registerControllers(container.resolve(AddGameController))

    await this.dbService.connect()
    await this.browser.launch()
    await this.server.listen()

    // graceful shutdown
    process.on('SIGINT', async () => {
      this.logger.info('[Main] received SIGINT signal')
      await this.dbService.disconnect()
      await this.server.close()
      process.exit(0)
    })
  }
}

container.resolve(Main).start()
