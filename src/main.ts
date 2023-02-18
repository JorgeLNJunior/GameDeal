import 'reflect-metadata'
import './dependencies/dependency.container'

import { container, inject, injectable } from 'tsyringe'

import { CronService } from './cron/cron.service'
import { DatabaseService } from './database/database.service'
import { PINO_LOGGER } from './dependencies/dependency.tokens'
import { AddGameController } from './http/modules/game/addGame.controller'
import { Server } from './http/server'
import { Browser } from './infra/browser'
import { GameQueue } from './queue/game.queue'
import { ApplicationLogger } from './types/logger.type'

@injectable()
export default class Main {
  constructor(
    private server: Server,
    private dbService: DatabaseService,
    private browser: Browser,
    private gameQueue: GameQueue,
    private cronService: CronService,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async start() {
    this.server.registerControllers(container.resolve(AddGameController))

    await this.dbService.connect()
    await this.browser.launch()
    await this.gameQueue.init()
    await this.cronService.start()
    await this.server.listen()

    this.logger.info('[Main] Application started')

    // gracefull shutdown
    process.on('SIGINT', async () => {
      this.logger.info('[Main] received SIGINT signal')
      await this.dbService.disconnect()
      await this.browser.close()
      await this.gameQueue.stop()
      await this.cronService.stop()
      await this.server.close()
      this.logger.info('[Main] Application stopped')
      process.exit(0)
    })
  }
}

container.resolve(Main).start()
