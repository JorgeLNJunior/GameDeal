import '@modules/infra/newrelic'
import 'reflect-metadata'
import '@dependencies/dependency.container'

import { LoginController } from '@api/routes/login/login.controller'
import { CronService } from '@cron/cron.service'
import { GameScrapingCronJob } from '@cron/jobs/gameScraping.cronjob'
import { DatabaseService } from '@database/database.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { Browser } from '@infra/browser'
import { NotificationService } from '@infra/notification/notification.service'
import { ApplicationLogger } from '@localtypes/logger.type'
import { AddGameController } from '@modules/api/routes/addGame/addGame.controller'
import { FindGameByIdController } from '@modules/api/routes/findGameById/findGameById.controller'
import { FindGamesController } from '@modules/api/routes/findGames/findGames.controller'
import { GetGamePriceController } from '@modules/api/routes/getCurrentGamePrice/getCurrentGamePrice.controller'
import { HealthController } from '@modules/api/routes/health/health.controller'
import { Server } from '@modules/api/server'
import { GameQueue } from '@queue/game.queue'
import { container, inject, injectable } from 'tsyringe'

@injectable()
export default class Main {
  /**
   * The main application class.
   * @param server - An instance of `erver`.
   * @param dbService - An instance of `DatabaseService`.
   * @param browser - An instance of `Browser`.
   * @param gameQueue - An instance of `GameQueue`.
   * @param cronService - An instance of `CronService`.
   * @param notificationService - An instance of `NotificationService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(
    private server: Server,
    private dbService: DatabaseService,
    private browser: Browser,
    private gameQueue: GameQueue,
    private cronService: CronService,
    private notificationService: NotificationService,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  /**
   * Starts the application and all its modules.
   * @example
   * ```
   * const main = new Main(params...).start()
   * ```
   */
  async start(): Promise<void> {
    this.server.registerControllers(
      container.resolve(AddGameController),
      container.resolve(FindGameByIdController),
      container.resolve(FindGamesController),
      container.resolve(GetGamePriceController),
      container.resolve(LoginController),
      container.resolve(HealthController)
    )
    this.cronService.registerJobs(container.resolve(GameScrapingCronJob))

    await this.dbService.connect()
    await this.browser.launch()
    await this.gameQueue.init()
    await this.notificationService.start()
    this.cronService.start()
    await this.server.listen()

    this.logger.info('[Main] application started')

    // gracefull shutdown
    process.on('SIGINT', async () => {
      this.logger.info('Main] received SIGINT signal')
      await this.dbService.disconnect()
      await this.browser.close()
      await this.gameQueue.stop()
      await this.notificationService.stop()
      this.cronService.stop()
      await this.server.close()
      this.logger.info('[Main] application stopped')
      process.exit(0)
    })
  }
}

container.resolve(Main).start()
