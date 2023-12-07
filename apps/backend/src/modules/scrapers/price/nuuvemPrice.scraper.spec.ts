import { AxiosService } from '@infra/axios.service'
import { PinoLogger } from '@infra/pino.logger'

import { CheerioParser } from '../parsers/cheerio.parser'
import { NuuvemPriceScraper } from './nuuvemPrice.scraper'

jest.setTimeout(30000)

describe('NuuvemPriceScraper', () => {
  let scraper: NuuvemPriceScraper
  let parser: CheerioParser
  let logger: PinoLogger

  beforeEach(async () => {
    logger = new PinoLogger()
    parser = new CheerioParser()
    const axios = new AxiosService(logger)
    scraper = new NuuvemPriceScraper(parser, logger, axios)
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

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce(undefined)

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it did not find a price', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce(undefined)
    const logSpy = jest.spyOn(logger, 'warn')

    await scraper.getGamePrice(gameUrl)

    expect(logSpy).toHaveBeenCalled()
  })

  it('should return null if it fails to parse a price', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce('invalid-price')

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should log if it fails to parse a price', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce('invalid-price')
    const logSpy = jest.spyOn(logger, 'error')

    await scraper.getGamePrice(gameUrl)

    expect(logSpy).toHaveBeenCalled()
  })

  it('should return null if a game is unavailable (br-en)', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce('Unavailable')

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })

  it('should return null if a game is unavailable (br-pt)', async () => {
    const gameUrl = 'https://www.nuuvem.com/br-en/item/god-of-war'

    jest.spyOn(parser, 'getSelectorValue').mockReturnValueOnce('Indisponível')

    const price = await scraper.getGamePrice(gameUrl)

    expect(price).toBe(null)
  })
})
