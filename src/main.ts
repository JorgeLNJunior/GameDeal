import 'reflect-metadata'
import './dependencies/dependency.container'

import dotenv from 'dotenv'
import { container, inject, injectable } from 'tsyringe'

import { PINO_LOGGER } from './dependencies/dependency.tokens'
import { CronService } from './modules/cron/cron.service'
import { GameScrapingCronJob } from './modules/cron/jobs/gameScraping.cronjob'
import { DatabaseService } from './modules/database/database.service'
import { AddGameController } from './modules/http/routes/addGame/addGame.controller'
import { GetGameController } from './modules/http/routes/getGame/getGame.controller'
import { Server } from './modules/http/server'
import { Browser } from './modules/infra/browser'
import { GameQueue } from './modules/queue/game.queue'
import { ApplicationLogger } from './types/logger.type'

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

@injectable()
export default class Main {
  /**
   * The main application class.
   *
   * @param server - An instance of `erver`.
   * @param dbService - An instance of `DatabaseService`.
   * @param browser - An instance of `Browser`.
   * @param gameQueue - An instance of `GameQueue`.
   * @param cronService - An instance of `CronService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(
    private server: Server,
    private dbService: DatabaseService,
    private browser: Browser,
    private gameQueue: GameQueue,
    private cronService: CronService,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  /**
   * Starts the application and all its modules.
   *
   * @example
   * ```
   * const main = new Main(params...).start()
   * ```
   */
  async start(): Promise<void> {
    this.server.registerControllers(
      container.resolve(AddGameController),
      container.resolve(GetGameController)
    )
    this.cronService.registerJobs(container.resolve(GameScrapingCronJob))

    await this.dbService.connect()
    await this.browser.launch()
    await this.gameQueue.init()
    this.cronService.start()
    await this.server.listen()

    this.logger.info('[Main] Application started')

    // gracefull shutdown
    process.on('SIGINT', async () => {
      this.logger.info('[Main] received SIGINT signal')
      await this.dbService.disconnect()
      await this.browser.close()
      await this.gameQueue.stop()
      this.cronService.stop()
      await this.server.close()
      this.logger.info('[Main] Application stopped')
      process.exit(0)
    })
  }
}

container.resolve(Main).start()
