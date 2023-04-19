import { Browser } from '@infra/browser'
import { PinoLogger } from '@infra/pino.logger'

import { GamersGateScraper } from './gamersGate.scraper'

jest.setTimeout(30000)

describe('GamersGateScraper', () => {
  let scraper: GamersGateScraper
  let browser: Browser

  beforeEach(async () => {
    const logger = new PinoLogger()
    browser = new Browser(logger)
    scraper = new GamersGateScraper(browser, logger)
    await browser.launch()
  })
  afterEach(async () => {
    await browser.close()
  })

  it('should return a price', async () => {
    const price = await scraper.getGamePrice(
      'https://www.gamersgate.com/product/overcooked-2'
    )

    console.log(price)

    expect(typeof price).toBe('number')
    expect(price).toBeGreaterThan(0)
  })

  it('should return a price if the game has age check', async () => {
    const price = await scraper.getGamePrice(
      'https://www.gamersgate.com/product/resident-evil-4'
    )

    expect(typeof price).toBe('number')
    expect(price).toBeGreaterThan(0)
  })
})
