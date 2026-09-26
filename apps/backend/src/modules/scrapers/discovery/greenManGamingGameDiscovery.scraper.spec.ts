import { CuimpService } from '@infra/cuimp.service'
import { PinoLogger } from '@infra/pino.logger'

import { GreenManGamingGameDiscoveryScraper } from './greenManGamingGameDiscovery.scraper'

describe('GreenManGamingGameDiscoveryScraper', () => {
  let scraper: GreenManGamingGameDiscoveryScraper

  beforeEach(async () => {
    const http = new CuimpService(new PinoLogger())
    scraper = new GreenManGamingGameDiscoveryScraper(http)
  })

  it.each([
    {
      title: 'Cities: Skylines II',
      url: 'https://www.greenmangaming.com/games/cities-skylines-ii-pc'
    },
    {
      title: 'The Last of Us™ Part I',
      url: 'https://www.greenmangaming.com/games/the-last-of-us-part-i-pc'
    },
    {
      title: 'Ratchet & Clank: Rift Apart',
      url: 'https://www.greenmangaming.com/games/ratchet-clank-rift-apart-pc'
    }
  ])('should discover the url of a game', async (data) => {
    const url = await scraper.discoverUrl(data.title)

    expect(url).toBeDefined()
  })
})
