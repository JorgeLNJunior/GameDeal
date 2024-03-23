import { AxiosService } from '@infra/axios.service'
import { PinoLogger } from '@infra/pino.logger'

import { NuuvemGameDiscoveryScraper } from './nuuvemGameDiscovery.scraper'

describe('NuuvemGameDiscoveryScraper', () => {
  let scraper: NuuvemGameDiscoveryScraper

  beforeEach(async () => {
    const axios = new AxiosService(new PinoLogger())
    scraper = new NuuvemGameDiscoveryScraper(axios)
  })

  it.each([
    {
      title: 'ELDEN RING',
      url: 'https://www.nuuvem.com/br-en/item/elden-ring'
    },
    {
      title: 'UNCHARTED™: Legacy of Thieves Collection',
      url: 'https://www.nuuvem.com/br-en/item/uncharted-legacy-of-thieves-collection'
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
