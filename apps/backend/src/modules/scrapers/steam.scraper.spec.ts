import { PinoLogger } from '@infra/pino.logger'

import { CheerioParser } from './parsers/cheerio.parser'
import { SteamScraper } from './steam.scraper'

describe('SteamScraper', () => {
  let scraper: SteamScraper
  let parser: CheerioParser
  let logger: PinoLogger

  beforeEach(async () => {
    logger = new PinoLogger()
    parser = new CheerioParser()
    scraper = new SteamScraper(parser, logger)
  })

  it('should return a price', async () => {
    const price = await scraper.getGamePrice(
      'https://store.steampowered.com/app/1245620/ELDEN_RING'
    )

    expect(price).toBeDefined()
    expect(typeof price).toBe('number')
  })

  it('should return null if it did not find a price', async () => {
    const gameUrl = 'https://store.steampowered.com/app/1245620/ELDEN_RING'

    jest.spyOn(parser, 'getElementValue').mockReturnValue(undefined)

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it did not find a price', async () => {
    const gameUrl = 'https://store.steampowered.com/app/1245620/ELDEN_RING'

    jest.spyOn(parser, 'getElementValue').mockReturnValue(undefined)
    const logSpy = jest.spyOn(logger, 'error')

    await scraper.getGamePrice(gameUrl)

    expect(logSpy).toHaveBeenCalled()
  })

  it('should return null if it fails to parse a price', async () => {
    const gameUrl = 'https://store.steampowered.com/app/1245620/ELDEN_RING'

    jest.spyOn(parser, 'getElementValue').mockReturnValueOnce('invalid-price')

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it fails to parse a price', async () => {
    const gameUrl = 'https://store.steampowered.com/app/1245620/ELDEN_RING'

    jest.spyOn(parser, 'getElementValue').mockReturnValueOnce('invalid-price')
    const logSpy = jest.spyOn(logger, 'error')

    await scraper.getGamePrice(gameUrl)

    expect(logSpy).toHaveBeenCalled()
  })

  it('should suport games with subscriptions', async () => {
    const price = await scraper.getGamePrice(
      'https://store.steampowered.com/app/1237970/Titanfall_2'
    )

    expect(price).toBeDefined()
    expect(typeof price).toBe('number')
  })

  it.each([
    'https://store.steampowered.com/app/271590/Grand_Theft_Auto_V',
    'https://store.steampowered.com/app/1938010/WILD_HEARTS'
  ])('should suport games with bundles', async (url) => {
    const price = await scraper.getGamePrice(url)

    expect(price).toBeDefined()
    expect(typeof price).toBe('number')
  })
})
