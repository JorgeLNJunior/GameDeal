import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import type { ApplicationCronJob } from '@localtypes/cron.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { SteamGameDiscoveryScraper } from '@scrapers/discovery/steamGameDiscovery.scraper'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GameDiscoveryCronJob implements ApplicationCronJob {
  public cronTime = '0 12 * * 0' // At UTC-3 12:00 on Sunday

  /**
   * Handles the game discovery cron job.
   *
   * @param steamGameDiscovery - An instance of SteamGameDiscoveryScraper
   * @param logger - An application logger.
   */
  constructor (
    private readonly steamGameDiscovery: SteamGameDiscoveryScraper,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  public async jobFunction (): Promise<void> {
    this.logger.info('[GameDiscoveryCronJob] running game discovery job')
    await this.steamGameDiscovery.discoveryGames()
    this.logger.info('[GameDiscoveryCronJob] game discovery job is finished')
  }
}
