import { Browser } from '../infra/browser'
import { PinoLogger } from '../infra/pino.logger'
import { SteamScraper } from './steam.scraper'

describe('SteamScraper', () => {
  let scraper: SteamScraper
  let browser: Browser

  beforeEach(async () => {
    const logger = new PinoLogger()
    browser = new Browser(logger)
    scraper = new SteamScraper(browser, logger)
    await browser.launch()
  })
  afterEach(async () => {
    await browser.close()
  })

  it('should return a price', async () => {
    const price = await scraper.getGamePrice(
      'https://store.steampowered.com/app/1593500/God_of_War'
    )

    expect(typeof price).toBe('number')
  })
})
