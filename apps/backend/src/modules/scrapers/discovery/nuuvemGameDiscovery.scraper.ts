import { DatabaseService } from '@database/database.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { AxiosService } from '@infra/axios.service'
import { ApplicationLogger } from '@localtypes/logger.type'
import type { GameDiscoveryScraper } from '@localtypes/scraper.type'
import * as cheerio from 'cheerio'
import { inject, injectable } from 'tsyringe'

@injectable()
export class NuuvemGameDiscoveryScraper implements GameDiscoveryScraper {
  constructor (
    private readonly database: DatabaseService,
    private readonly axios: AxiosService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async discoveryGames (): Promise<void> {
    try {
      const client = this.database.getClient()
      let gamesAdded = 0

      const games = await client
        .selectFrom('game')
        .select(['id', 'title'])
        .where('nuuvem_url', 'is', null)
        .execute()

      for (const game of games) {
        const steamTitle = this.normalizeTitle(game.title).toLocaleLowerCase()
        const body = await this.axios.get<string>(`https://www.nuuvem.com/br-en/catalog/drm/steam/platforms/pc/page/1/search/${steamTitle}`)

        const wrapper = cheerio.load(body)
        const data = wrapper('div.product-card--grid > div > a').toArray()

        for (const element of data) {
          const nuuvemTitle = this.normalizeTitle(element.attribs.title).toLowerCase()
          const url = element.attribs.href

          if (nuuvemTitle === steamTitle) {
            await client
              .updateTable('game')
              .set({ nuuvem_url: url })
              .where('id', '=', game.id)
              .execute()
            this.logger.info(`[NuuvemGameDiscoveryScraper] added "${game.title}"`)
            gamesAdded = ++gamesAdded
            break
          }
        }
      }

      this.logger.info(`[NuuvemGameDiscoveryScraper] added "${gamesAdded}" new games`)
    } catch (error) {
      this.logger.error(error, '[NuuvemGameDiscoveryScraper] game discovery failed')
    }
  }

  private normalizeTitle (title: string): string {
    return title.replaceAll('™', '')
      .replaceAll('®', '')
      .replaceAll('.', ' ')
      .replaceAll('/', '')
      .replaceAll(':', '')
      .replaceAll('-', '')
      .replaceAll('!', '')
      .replaceAll('%', '')
  }
}
