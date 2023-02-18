import { CronJob } from 'cron'
import { inject, injectable } from 'tsyringe'

import { PINO_LOGGER } from '../dependencies/dependency.tokens'
import { GameRepository } from '../http/modules/game/game.repository'
import { GameQueue } from '../queue/game.queue'
import { ApplicationLogger } from '../types/logger.type'

@injectable()
export class CronService {
  private jobs: CronJob[] = []

  constructor(
    private gameQueue: GameQueue,
    private gameRepository: GameRepository,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async start(): Promise<void> {
    this.logger.info('[CronService] starting cron service')
    const gameScrapingJob = new CronJob('52 14 * * *', async () => {
      this.logger.info('[CronService] Running game scraping job')

      const games = await this.gameRepository.findSteamScraperData()

      const promises = games.map(async (game) => {
        await this.gameQueue.add({
          gameId: game.id,
          gameUrl: game.steam_url
        })
      })

      const results = await Promise.allSettled(promises)
      results.forEach((result) => {
        if (result.status === 'rejected') {
          this.logger.error(
            result.reason,
            `[CronService] Failed to add a game to the queue`
          )
        }
      })

      this.logger.info('[CronService] Finished game scraping job')
    })

    this.jobs.push(gameScrapingJob)

    this.jobs.forEach((job) => job.start())
  }

  async stop(): Promise<void> {
    this.logger.info('[CronService] Stopping all jobs')
    this.jobs.forEach((job) => {
      job.stop()
    })
  }
}
