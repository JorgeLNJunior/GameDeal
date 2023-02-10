import { injectable } from 'tsyringe'

import { Browser } from '../infra/browser'
import { Logger } from '../infra/logger'
import { Scraper } from './scraper.interface'

@injectable()
export class SteamScraper implements Scraper {
  constructor(private browser: Browser, private logger: Logger) {}

  async getGamePrice(url: string): Promise<number> {
    this.logger.info('[SteamScraper] getting a page')
    const page = await this.browser.getPage()

    try {
      this.logger.info(`[SteamScraper] Navigating to ${url}`)
      await page.goto(url, { waitUntil: 'domcontentloaded' })

      this.logger.info('[SteamScraper] waiting for page selector')
      await page.waitForSelector('.game_area_purchase_game_wrapper')

      const price = await page
        .locator('div.game_area_purchase_game_wrapper .game_purchase_price')
        .textContent()

      if (!price) {
        this.logger.error(`No price found for ${url}`)
        throw new Error('Game price not found')
      }

      return Number(price.replace('R$', '').replace(',', '.').trim())
    } finally {
      this.logger.info('[SteamScraper] closing the page')
      await page.close()
      this.logger.info('[SteamScraper] page closed')
    }
  }
}
