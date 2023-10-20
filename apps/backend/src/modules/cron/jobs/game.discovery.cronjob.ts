import { DatabaseService } from '@database/database.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import type { ApplicationCronJob } from '@localtypes/cron.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { QueueJobName } from '@localtypes/queue.type'
import { GameDiscoveryQueue } from '@queue/gameDiscovery.queue'
import { SteamGameDiscoveryScraper } from '@scrapers/discovery/steamGameDiscovery.scraper'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GameDiscoveryCronJob implements ApplicationCronJob {
  public cronTime = '0 12 * * 0' // At UTC-3 12:00 on Sunday

  /**
   * Handles the game discovery cron job.
   *
   * @param database - An instance of DatabaseService
   * @param queue - An instance of GameDiscoveryQueue
   * @param logger - An application logger.
   */
  constructor (
    private readonly database: DatabaseService,
    private readonly queue: GameDiscoveryQueue,
    private readonly steamDiscovery: SteamGameDiscoveryScraper,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  public async jobFunction (): Promise<void> {
    this.logger.info('[GameDiscoveryCronJob] running game discovery job')

    await this.steamDiscovery.discoveryGames()

    const client = this.database.getClient()
    const gamesWithoutNuuvemUrl = await client
      .selectFrom('game')
      .select(['id', 'title'])
      .where('nuuvem_url', 'is', null)
      .execute()

    for (const game of gamesWithoutNuuvemUrl) {
      await this.queue.add(QueueJobName.NUUVEM_GAME_DISCOVERY, game)
    }

    this.logger.info('[GameDiscoveryCronJob] game discovery job is finished')
  }
}
