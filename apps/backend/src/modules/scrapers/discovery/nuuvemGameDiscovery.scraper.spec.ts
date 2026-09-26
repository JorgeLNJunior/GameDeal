import { CuimpService } from '@infra/cuimp.service'
import { PinoLogger } from '@infra/pino.logger'

import { NuuvemGameDiscoveryScraper } from './nuuvemGameDiscovery.scraper'

describe('NuuvemGameDiscoveryScraper', () => {
  let scraper: NuuvemGameDiscoveryScraper

  beforeEach(async () => {
    const http = new CuimpService(new PinoLogger())
    scraper = new NuuvemGameDiscoveryScraper(http)
  })

  it.each([
    {
      title: 'ELDEN RING',
      url: 'https://www.nuuvem.com/br-en/item/elden-ring'
    },
    {
      title: 'Middle-earth: Shadow of Mordor - Game of the Year Edition',
      url: 'https://www.nuuvem.com/br-en/item/2372-middle-earth-shadow-of-mordor-game-of-the-year-edition'
    },
    {
      title: 'DARK SOULS™ III',
      url: 'https://www.nuuvem.com/br-en/item/dark-souls-iii'
    }
  ])('should discover the url of the game "$title"', async (data) => {
    const url = await scraper.discoverUrl(data.title)

    expect(url).toBeDefined()
  })
})
