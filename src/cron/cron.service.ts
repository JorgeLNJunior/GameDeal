import { CronJob } from 'cron'
import { injectable } from 'tsyringe'

import { GameRepository } from '../http/modules/game/game.repository'
import { Logger } from '../infra/logger'
import { GameQueue } from '../queue/game.queue'

@injectable()
export class CronService {
  private jobs: CronJob[] = []

  constructor(
    private logger: Logger,
    private gameQueue: GameQueue,
    private gameRepository: GameRepository
  ) {}

  async start(): Promise<void> {
    const gameScrapingJob = new CronJob('00 00 * * *', async () => {
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
    this.jobs.forEach((job) => {
      job.stop()
    })
  }
}
