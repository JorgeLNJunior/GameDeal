import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { Browser } from '@infra/browser'
import { ApplicationLogger } from '@localtypes/logger.type'
import { Scraper } from '@localtypes/scraper.type'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SteamScraper implements Scraper {
  /**
   * Handles all steam scraping process.
   *
   * @param browser - An instance of `Browser`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(
    private browser: Browser,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  /**
   * Gets the game price. Suports normal and sale prices.
   *
   * @example
   * ```
   * const price = await scraper.getGamePrice(data);
   * ```
   * @param url - The steam game url.
   * @returns The current steam game price.
   */
  async getGamePrice(url: string): Promise<number> {
    // makes steam show brazilian prices
    url += '?cc=br'

    this.logger.info('[SteamScraper] getting a page')
    const page = await this.browser.getPage()

    try {
      this.logger.info(`[SteamScraper] Navigating to ${url}`)
      await page.goto(url, { waitUntil: 'domcontentloaded' })

      this.logger.info('[SteamScraper] waiting for page selector')
      await page.waitForSelector('.game_area_purchase_game_wrapper')

      const price = await page
        .locator('div.game_area_purchase_game_wrapper div.game_purchase_price')
        .evaluateAll((elements: HTMLDivElement[]) => {
          const firtOcurrence = elements.at(0)
          if (firtOcurrence && firtOcurrence.textContent) {
            return firtOcurrence.textContent
          }
          return undefined
        })
      if (price) return Number(price.replace('R$', '').replace(',', '.').trim())

      const salePrice = await page
        .locator('div.game_area_purchase_game_wrapper div.discount_final_price')
        .evaluateAll((elements: HTMLDivElement[]) => {
          const firtOcurrence = elements.at(0)
          if (firtOcurrence && firtOcurrence.textContent) {
            return firtOcurrence.textContent
          }
          return undefined
        })
      if (salePrice) {
        return Number(salePrice.replace('R$', '').replace(',', '.').trim())
      }

      this.logger.error(`No price found for ${url}`)
      throw new Error('Game price not found')
    } finally {
      this.logger.info('[SteamScraper] closing the page')
      await page.close()
      this.logger.info('[SteamScraper] page closed')
    }
  }
}
