import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import type { ApplicationCronJob } from '@localtypes/cron.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { GamePriceQueue } from '@queue/gamePrice.queue'
import { inject, injectable } from 'tsyringe'

import { FindGameScraperDataRepository } from './repositories/findGameScraperData.repository'

@injectable()
export class GameScrapingCronJob implements ApplicationCronJob {
  public cronTime = '0 3 * * *' // At UTC-3 00:00

  /**
   * Handles the game scraping cron job.
   * @param findGameScraperDataRepository - A game FindGameScraperDataRepository instance.
   * @param GamePriceQueue - A game queue instance.
   * @param logger - An application logger.
   */
  constructor (
    private readonly findGameScraperDataRepository: FindGameScraperDataRepository,
    private readonly GamePriceQueue: GamePriceQueue,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  public async jobFunction (): Promise<void> {
    this.logger.info('[GameScrapingCronJob] running game scraping job')

    const games = await this.findGameScraperDataRepository.find()

    const promises = games.map(async (game) => {
      await this.GamePriceQueue.add({
        gameId: game.id,
        steamUrl: game.steam_url,
        nuuvemUrl: game.nuuvem_url,
        greenManGamingUrl: game.green_man_gaming_url
      })
    })

    const results = await Promise.allSettled(promises)
    results.forEach((result) => {
      if (result.status === 'rejected') {
        this.logger.error(
          result.reason,
          '[GameScrapingCronJob] failed to add a game to the queue'
        )
      }
    })

    this.logger.info('[GameScrapingCronJob] game scraping job is finished')
  }
}
