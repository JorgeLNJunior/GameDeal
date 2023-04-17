import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationCronJob } from '@localtypes/cron.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { GameQueue } from '@queue/game.queue'
import { inject, injectable } from 'tsyringe'

import { FindGameScraperDataRepository } from './repositories/findGameScraperData.repository'

@injectable()
export class GameScrapingCronJob implements ApplicationCronJob {
  public cronTime = '0 */6 * * *' // At minute 0 past every 6th hour

  /**
   * Handles the game scraping cron job.
   *
   * @param findGameScraperDataRepository - A game FindGameScraperDataRepository instance.
   * @param gameQueue - A game queue instance.
   * @param logger - An application logger.
   */
  constructor(
    private findGameScraperDataRepository: FindGameScraperDataRepository,
    private gameQueue: GameQueue,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  public async jobFunction(): Promise<void> {
    this.logger.info('[GameScrapingCronJob] running the game scraping job')

    const games = await this.findGameScraperDataRepository.find()

    const promises = games.map(async (game) => {
      await this.gameQueue.add({
        gameId: game.id,
        steamUrl: game.steam_url,
        nuuvemUrl: game.nuuvem_url
      })
    })

    const results = await Promise.allSettled(promises)
    results.forEach((result) => {
      if (result.status === 'rejected') {
        this.logger.error(
          result.reason,
          `[GameScrapingCronJob] failed to add a game to the queue`
        )
      }
    })

    this.logger.info('[GameScrapingCronJob] the game scraping job is finished')
  }
}
