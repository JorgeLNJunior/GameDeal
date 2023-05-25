import '@modules/infra/newrelic'
import 'reflect-metadata'
import '@dependencies/dependency.container'

import { AddGameController } from '@api/controllers/addGame/addGame.controller'
import { FindGameByIdController } from '@api/controllers/findGameById/findGameById.controller'
import { FindGamesController } from '@api/controllers/findGames/findGames.controller'
import { GetGamePriceController } from '@api/controllers/getCurrentGamePrice/getCurrentGamePrice.controller'
import { GetGamePriceHistoryController } from '@api/controllers/getGamePriceHistory/getGamePriceHistory.controller'
import { GetLowestHistoricalPriceController } from '@api/controllers/getLowestHistoricalPrice/getLowestHistoricalPrice.controller'
import { HealthController } from '@api/controllers/health/health.controller'
import { LoginController } from '@api/controllers/login/login.controller'
import { CronService } from '@cron/cron.service'
import { GameScrapingCronJob } from '@cron/jobs/gameScraping.cronjob'
import { DatabaseService } from '@database/database.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { Server } from '@modules/api/server'
import { GameWorker } from '@modules/worker/game/game.worker'
import { NotificationWorker } from '@modules/worker/notification/notification.worker'
import { GameQueue } from '@queue/game.queue'
import { NotificationQueue } from '@queue/notification.queue'
import { container, inject, injectable } from 'tsyringe'

@injectable()
export default class Main {
  /**
   * The main application class.
   * @param server - An instance of `erver`.
   * @param dbService - An instance of `DatabaseService`.
   * @param gameQueue - An instance of `GameQueue`.
   * @param notificationQueue - An instance of `NotificationQueue`
   * @param gameWorker - An instance of `GameWorker`.
   * @param notificationWorker - An instance of `NotificationWorker`.
   * @param cronService - An instance of `CronService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(
    private server: Server,
    private dbService: DatabaseService,
    private gameQueue: GameQueue,
    private notificationQueue: NotificationQueue,
    private gameWorker: GameWorker,
    private notificationWorker: NotificationWorker,
    private cronService: CronService,
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
    try {
      this.server.registerControllers(
        container.resolve(AddGameController),
        container.resolve(FindGameByIdController),
        container.resolve(FindGamesController),
        container.resolve(GetGamePriceController),
        container.resolve(GetGamePriceHistoryController),
        container.resolve(GetLowestHistoricalPriceController),
        container.resolve(LoginController),
        container.resolve(HealthController)
      )
      this.cronService.registerJobs(container.resolve(GameScrapingCronJob))

      await this.dbService.connect()
      await this.gameQueue.init()
      await this.gameWorker.init()
      await this.notificationQueue.init()
      await this.notificationWorker.init()
      this.cronService.start()
      await this.server.listen()

      this.logger.info('[Main] application started')

      // gracefull shutdown
      process.on('SIGINT', async () => {
        this.logger.info('Main] received SIGINT signal')
        await this.server.close()
        await this.dbService.disconnect()
        await this.gameQueue.stop()
        await this.gameWorker.stop()
        await this.notificationQueue.init()
        await this.notificationWorker.init()
        this.cronService.stop()
        this.logger.info('[Main] application stopped')
        process.exit(0)
      })
    } catch (error) {
      this.logger.error(error, '[Main] application failed')
      process.exit(1)
    }
  }
}

container.resolve(Main).start()
