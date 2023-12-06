import { DatabaseService } from '@database/database.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { AxiosService } from '@infra/axios.service'
import { ApplicationLogger } from '@localtypes/logger.type'
import { QueueJobName } from '@localtypes/queue.type'
import type { GameDiscoveryScraper } from '@localtypes/scraper.type'
import { NotificationQueue } from '@queue/notification.queue'
import * as cheerio from 'cheerio'
import { randomUUID } from 'crypto'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SteamGameDiscoveryScraper implements GameDiscoveryScraper {
  constructor (
    private readonly database: DatabaseService,
    private readonly axios: AxiosService,
    private readonly notificationQueue: NotificationQueue,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async discoveryGames (pages = 15): Promise<void> {
    try {
      const client = this.database.getClient()
      const games: InsertData[] = []
      let gamesAdded = 0

      // global top sellers
      this.logger.info('[SteamGameDiscoveryScraper] searching by global top sellers')
      for (let page = 1; page <= pages; page++) {
        this.logger.info(`[SteamGameDiscoveryScraper] searching at page ${page}`)
        const data = await this.axios.get<string>(`https://store.steampowered.com/search/?cc=br&filter=globaltopsellers&category1=998&hidef2p=1&ndl=1&page=${page}`)
        const wrapper = cheerio.load(data)

        wrapper('a.search_result_row').each((_index, element) => {
          const id = randomUUID()
          const title = this.normalizeTitle(wrapper(element).find('span.title').text())
          const url = element.attribs.href.split('/?').shift() as string // removes the query string
          games.push({ id, title, url })
        })
      }

      // most relevants
      this.logger.info('[SteamGameDiscoveryScraper] searching by most relevants')
      for (let page = 1; page <= pages; page++) {
        this.logger.info(`[SteamGameDiscoveryScraper] searching at page ${page}`)
        const data = await this.axios.get<string>(`https://store.steampowered.com/search/?cc=br&category1=998&hidef2p=1&ndl=1&page=${page}`)
        const wrapper = cheerio.load(data)

        wrapper('a.search_result_row ').each((_index, element) => {
          const id = randomUUID()
          const title = this.normalizeTitle(wrapper(element).find('span.title').text())
          const url = element.attribs.href.split('/?').shift() as string // removes the query string
          games.push({ id, title, url })
        })
      }

      this.logger.info('[SteamGameDiscoveryScraper] starting database inserts')
      for (const game of games) {
        const isGameInserted = await client
          .selectFrom('game')
          .select('id')
          .where('title', '=', game.title)
          .executeTakeFirst()
        if (isGameInserted != null) continue

        const isGameIgnored = await client
          .selectFrom('game_ignore_list')
          .select('id')
          .where('title', '=', game.title)
          .executeTakeFirst()
        if (isGameIgnored != null) continue

        await client.insertInto('game').values({
          id: game.id,
          title: game.title,
          steam_url: game.url
        }).execute()

        this.logger.info(`[SteamGameDiscovery] added "${game.title}"`)
        gamesAdded = ++gamesAdded
      }

      await this.notificationQueue.add(QueueJobName.NOTIFY_NEW_GAMES, { count: gamesAdded })
      this.logger.info(`[SteamGameDiscovery] added "${gamesAdded}" new games`)
    } catch (error) {
      this.logger.error(error, '[SteamGameDiscovery] game discovery failed')
    }
  }

  private normalizeTitle (title: string): string {
    return title.replace('™', '').replace('®', '')
  }
}

interface InsertData {
  id: string
  title: string
  url: string
}
