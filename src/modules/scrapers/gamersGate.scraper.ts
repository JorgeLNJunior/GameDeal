import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { Browser } from '@infra/browser'
import { ApplicationLogger } from '@localtypes/logger.type'
import { Scraper } from '@localtypes/scraper.type'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GamersGateScraper implements Scraper {
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
    this.logger.info('[GamersGateScraper] getting a page')
    const page = await this.browser.getPage()

    try {
      this.logger.info(`[GamersGateScraper] navigating to ${url}`)
      await page.goto(url, { waitUntil: 'domcontentloaded' })

      const hasAgeCheck = await page.$('.check-age-form-container')
      if (hasAgeCheck) {
        this.logger.info('[GamersGateScraper] passing through age check')
        await page
          .locator('input[name="age_year"]')
          .evaluate((element: HTMLInputElement) => {
            element.value = '1990'
          })
        await page.locator('button[type="submit"]').click()
      }

      this.logger.info('[GamersGateScraper] waiting for the page selector')
      await page.waitForSelector('div.catalog-item--price > span', {
        timeout: 120000
      })

      const price = await page
        .locator('div.catalog-item--price > span')
        .evaluateAll((elements: HTMLDivElement[]) => {
          const firtOcurrence = elements.at(0)
          if (firtOcurrence && firtOcurrence.textContent) {
            return firtOcurrence.textContent
          }
          return undefined
        })
      if (price) return Number(price.replace('R$', '').replace(',', '.').trim())

      this.logger.error(`[GamersGateScraper] no price found for ${url}`)
      throw new Error('Game price not found')
    } finally {
      this.logger.info('[GamersGateScraper] closing the page')
      await page.close()
      this.logger.info('[GamersGateScraper] the page was closed')
    }
  }
}
