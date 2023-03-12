import { Browser } from '@infra/browser'
import { PinoLogger } from '@infra/pino.logger'

import { NuuvemScraper } from './nuuvem.scraper'

jest.setTimeout(30000)

describe('NuuvemScraper', () => {
  let scraper: NuuvemScraper
  let browser: Browser

  beforeEach(async () => {
    const logger = new PinoLogger()
    browser = new Browser(logger)
    scraper = new NuuvemScraper(browser, logger)
    await browser.launch()
  })
  afterEach(async () => {
    await browser.close()
  })

  it('should return a price', async () => {
    const price = await scraper.getGamePrice(
      'https://www.nuuvem.com/br-en/item/god-of-war'
    )

    expect(typeof price).toBe('number')
    expect(price).toBeGreaterThan(0)
  })
})
