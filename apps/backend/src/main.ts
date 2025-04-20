import '@modules/infra/newrelic'
import 'reflect-metadata'
import '@dependencies/dependency.container'

import { AddGameController } from '@api/controllers/addGame/addGame.controller'
import { AddIgnoredGamesController } from '@api/controllers/addIgnoredGames/addIgnoredGames.controller'
import { CountGamesController } from '@api/controllers/countGames/countGames.controller'
import { DeleteGameController } from '@api/controllers/deleteGame/deleteGame.controller'
import { FindGameByIdController } from '@api/controllers/findGameById/findGameById.controller'
import { FindGamesController } from '@api/controllers/findGames/findGames.controller'
import { GetCurrentGamePriceController } from '@api/controllers/getCurrentGamePrice/getCurrentGamePrice.controller'
import { GetGamePriceHistoryController } from '@api/controllers/getGamePriceHistory/getGamePriceHistory.controller'
import { GetIgnoredGamesController } from '@api/controllers/getIgnoredGames/getIgnoredGames.controller'
import { GetLowestPriceController } from '@api/controllers/getLowestPrice/getLowestPrice.controller'
import { GetPriceDropsController } from '@api/controllers/getPriceDrops/getPriceDrop.controller'
import { HealthController } from '@api/controllers/health/health.controller'
import { LoginController } from '@api/controllers/login/login.controller'
import { RedirectToDocsController } from '@api/controllers/redirectToDocs/redirectToDocs.controller'
import { RemoveIgnoredGamesController } from '@api/controllers/removeIgnoredGames/removeIgnoredGames.controller'
import { UpdateGameController } from '@api/controllers/updateGame/updateGame.controller'
import { Server } from '@api/server'
import { CronService } from '@cron/cron.service'
import { DatabaseMaintanceCronJob } from '@cron/jobs/databaseMaintance.cronjob'
import { GameDiscoveryCronJob } from '@cron/jobs/game.discovery.cronjob'
import { GameScrapingCronJob } from '@cron/jobs/gameScraping.cronjob'
import { RemoveInvalidLinksCronJob } from '@cron/jobs/removeInvalidLinks.conjob'
import { DatabaseService } from '@database/database.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { PinoLogger } from '@infra/pino.logger'
import { ApplicationLogger } from '@localtypes/logger.type'
import { GameDiscoveryQueue } from '@queue/gameDiscovery.queue'
import { GamePriceQueue } from '@queue/gamePrice.queue'
import { NotificationQueue } from '@queue/notification.queue'
import { GameWorker } from '@workers/game/game.worker'
import { GameDiscoveryWorker } from '@workers/game/gameDiscovery.worker'
import { NotificationWorker } from '@workers/notification/notification.worker'
import { container, inject, injectable } from 'tsyringe'

@injectable()
export default class Main {
  /**
   * The main application class.
   * @param server - An instance of `erver`.
   * @param dbService - An instance of `DatabaseService`.
   * @param GamePriceQueue - An instance of `GamePriceQueue`.
   * @param gameDiscoveryQueue - An instance of `GameDiscoveryQueue`.
   * @param notificationQueue - An instance of `NotificationQueue`
   * @param gameWorker - An instance of `GameWorker`.
   * @param gameDiscoveryWorker - An instance of `GameDiscoveryWorker`.
   * @param notificationWorker - An instance of `NotificationWorker`.
   * @param cronService - An instance of `CronService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(
    private readonly server: Server,
    private readonly dbService: DatabaseService,
    private readonly gamePriceQueue: GamePriceQueue,
    private readonly gameDiscoveryQueue: GameDiscoveryQueue,
    private readonly notificationQueue: NotificationQueue,
    private readonly gameWorker: GameWorker,
    private readonly gameDiscoveryWorker: GameDiscoveryWorker,
    private readonly notificationWorker: NotificationWorker,
    private readonly cronService: CronService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) { }

  /**
   * Starts the application and all its modules.
   * @example
   * ```
   * const main = new Main(...params).start()
   * ```
   */
  async start(): Promise<void> {
    try {
      await this.server.registerPlugins()
      this.server.registerControllers(
        container.resolve(LoginController),
        container.resolve(AddGameController),
        container.resolve(CountGamesController),
        container.resolve(FindGameByIdController),
        container.resolve(FindGamesController),
        container.resolve(GetCurrentGamePriceController),
        container.resolve(GetGamePriceHistoryController),
        container.resolve(GetLowestPriceController),
        container.resolve(UpdateGameController),
        container.resolve(DeleteGameController),
        container.resolve(GetPriceDropsController),
        container.resolve(GetIgnoredGamesController),
        container.resolve(AddIgnoredGamesController),
        container.resolve(RemoveIgnoredGamesController),
        container.resolve(RedirectToDocsController),
        container.resolve(HealthController)
      )
      this.cronService.registerJobs(
        container.resolve(GameScrapingCronJob),
        container.resolve(GameDiscoveryCronJob),
        container.resolve(DatabaseMaintanceCronJob),
        container.resolve(RemoveInvalidLinksCronJob)
      )

      await this.dbService.connect()

      await this.gamePriceQueue.init()
      await this.gameDiscoveryQueue.init()
      await this.notificationQueue.init()

      await this.gameWorker.init()
      await this.gameDiscoveryWorker.init()
      await this.notificationWorker.init()

      this.cronService.start()
      await this.server.listen()

      // gracefull shutdown

      process.on('SIGINT', async () => {
        this.logger.info('Main] received SIGINT signal')
        await this.server.close()
        await this.dbService.disconnect()

        await this.gamePriceQueue.stop()
        await this.gameDiscoveryQueue.stop()
        await this.notificationQueue.stop()

        await this.gameWorker.stop()
        await this.gameDiscoveryWorker.stop()
        await this.notificationWorker.stop()
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

; void (async () => {
  await container.resolve(Main).start().then(() => {
    new PinoLogger().info('[Main] application started')
  })
})()
