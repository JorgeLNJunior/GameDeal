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

    jest.spyOn(parser, 'getElementValue').mockReturnValueOnce(undefined)

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it did not find a price', async () => {
    const gameUrl = 'https://store.steampowered.com/app/1245620/ELDEN_RING'

    jest.spyOn(parser, 'getElementValue').mockReturnValueOnce(undefined)
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
})