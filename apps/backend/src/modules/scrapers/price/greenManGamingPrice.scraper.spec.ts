import { AxiosService } from '@infra/axios.service'
import { PinoLogger } from '@infra/pino.logger'

import { CheerioParser } from '../parsers/cheerio.parser'
import { GreenManGamingPriceScraper } from './greenManGamingPrice.scraper'

jest.setTimeout(30000)

describe('GreenManGamingPriceScraper', () => {
  let scraper: GreenManGamingPriceScraper
  let parser: CheerioParser
  let logger: PinoLogger

  beforeEach(async () => {
    const axios = new AxiosService(logger)
    logger = new PinoLogger()
    parser = new CheerioParser()
    scraper = new GreenManGamingPriceScraper(parser, logger, axios)
  })

  it('should return a price', async () => {
    const price = await scraper.getGamePrice(
      'https://www.greenmangaming.com/games/god-of-war-pc'
    )

    expect(price).toBeDefined()
    expect(typeof price).toBe('number')
  })

  it('should return null if it did not find a price', async () => {
    const gameUrl = 'https://www.greenmangaming.com/games/god-of-war-pc'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce(undefined)

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it did not find a price', async () => {
    const gameUrl = 'https://www.greenmangaming.com/games/god-of-war-pc'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce(undefined)
    const logSpy = jest.spyOn(logger, 'warn')

    await scraper.getGamePrice(gameUrl)

    expect(logSpy).toHaveBeenCalled()
  })

  it('should return null if it fails to parse a price', async () => {
    const gameUrl = 'https://www.greenmangaming.com/games/god-of-war-pc'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce('invalid-price')

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it fails to parse a price', async () => {
    const gameUrl = 'https://www.greenmangaming.com/games/god-of-war-pc'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce('invalid-price')
    const logSpy = jest.spyOn(logger, 'error')

    await scraper.getGamePrice(gameUrl)

    expect(logSpy).toHaveBeenCalled()
  })
})
