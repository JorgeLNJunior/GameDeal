import { PinoLogger } from '@infra/pino.logger'

import { NuuvemScraper } from './nuuvem.scraper'
import { CheerioParser } from './parsers/cheerio.parser'

jest.setTimeout(30000)

describe('NuuvemScraper', () => {
  let scraper: NuuvemScraper
  let parser: CheerioParser
  let logger: PinoLogger

  beforeEach(async () => {
    logger = new PinoLogger()
    parser = new CheerioParser()
    scraper = new NuuvemScraper(parser, logger)
  })

  it('should return a price', async () => {
    const price = await scraper.getGamePrice(
      'https://www.nuuvem.com/br-en/item/god-of-war'
    )

    expect(price).toBeDefined()
    expect(typeof price).toBe('number')
  })

  it('should return null if it did not find a price', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getElementValue').mockReturnValueOnce(undefined)

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it did not find a price', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getElementValue').mockReturnValueOnce(undefined)
    const logSpy = jest.spyOn(logger, 'error')

    await scraper.getGamePrice(gameUrl)

    expect(logSpy).toHaveBeenCalled()
  })

  it('should return null if it fails to parse a price', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getElementValue').mockReturnValueOnce('invalid-price')

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it fails to parse a price', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getElementValue').mockReturnValueOnce('invalid-price')
    const logSpy = jest.spyOn(logger, 'error')

    await scraper.getGamePrice(gameUrl)

    expect(logSpy).toHaveBeenCalled()
  })
})
