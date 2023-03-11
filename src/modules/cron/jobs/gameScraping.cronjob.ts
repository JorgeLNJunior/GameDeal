import { GameRepository } from '@database/repositories/game.repository'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationCronJob } from '@localtypes/cron.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { GameQueue } from '@queue/game.queue'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GameScrapingCronJob implements ApplicationCronJob {
  public cronTime = '00 00 * * *'

  /**
   * Handles the game scraping cron job.
   *
   * @param gameRepository - A game repository instance.
   * @param gameQueue - A game queue instance.
   * @param logger - An application logger.
   */
  constructor(
    private gameRepository: GameRepository,
    private gameQueue: GameQueue,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  public async jobFunction(): Promise<void> {
    this.logger.info('[GameScrapingCronJob] Running game scraping job')

    const games = await this.gameRepository.findSteamScraperData()

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
          `[GameScrapingCronJob] Failed to add a game to the queue`
        )
      }
    })

    this.logger.info('[GameScrapingCronJob] Finished game scraping job')
  }
}
