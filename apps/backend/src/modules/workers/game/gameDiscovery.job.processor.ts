import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { type GameDiscoveryScraperData, QueueJobName } from '@localtypes/queue.type'
import { GreenManGamingGameDiscoveryScraper } from '@scrapers/discovery/greenManGamingGameDiscovery.scraper'
import { NuuvemGameDiscoveryScraper } from '@scrapers/discovery/nuuvemGameDiscovery.scraper'
import { inject, injectable } from 'tsyringe'

import { UpdateGameUrlRepository } from './repositories/updateGameUrl.repository'

@injectable()
export class GameDiscoveryJobProcessor {
  constructor (
    private readonly nuuvemDiscovery: NuuvemGameDiscoveryScraper,
    private readonly gmgDiscovery: GreenManGamingGameDiscoveryScraper,
    private readonly repository: UpdateGameUrlRepository,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async findUrls (job: QueueJobName, data: GameDiscoveryScraperData): Promise<void> {
    if (job === QueueJobName.NUUVEM_GAME_DISCOVERY) {
      const url = await this.nuuvemDiscovery.discoverUrl(data.title)
      if (url != null) {
        this.logger.info(`[GameDiscoveryJobProcessor] found a nuuvem url for "${data.title}"`)
        await this.repository.update(data.id, { nuuvem_url: url })
      }
      return
    }

    if (job === QueueJobName.GREEN_MAN_GAMING_GAME_DISCOVERY) {
      const url = await this.gmgDiscovery.discoverUrl(data.title)
      if (url != null) {
        this.logger.info(`[GameDiscoveryJobProcessor] found a green man gaming url for "${data.title}"`)
        await this.repository.update(data.id, { green_man_gaming_url: url })
      }
      return
    }

    this.logger.error(`[GameDiscoveryJobProcessor] "${job}" is an invalid job name`)
    throw new Error(`"${job}" is an invalid job name`)
  }
}
