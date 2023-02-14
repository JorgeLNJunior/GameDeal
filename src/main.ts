import 'reflect-metadata'

import { container, injectable } from 'tsyringe'

import { CronService } from './cron/cron.service'
import { DatabaseService } from './database/database.service'
import { AddGameController } from './http/modules/game/addGame.controller'
import { Server } from './http/server'
import { Browser } from './infra/browser'
import { Logger } from './infra/logger'
import { GameQueue } from './queue/game.queue'

@injectable()
export default class Main {
  constructor(
    private server: Server,
    private dbService: DatabaseService,
    private browser: Browser,
    private gameQueue: GameQueue,
    private cronService: CronService,
    private logger: Logger
  ) {}

  async start() {
    this.server.registerControllers(container.resolve(AddGameController))

    await this.dbService.connect()
    await this.gameQueue.init()
    await this.cronService.start()
    await this.browser.launch()
    await this.server.listen()

    this.logger.info('[Main] Application started')

    // gracefull shutdown
    process.on('SIGINT', async () => {
      this.logger.info('[Main] received SIGINT signal')
      await this.dbService.disconnect()
      await this.gameQueue.stop()
      await this.cronService.stop()
      await this.browser.close()
      await this.server.close()
      this.logger.info('[Main] Application stopped')
      process.exit(0)
    })
  }
}

container.resolve(Main).start()
