import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { Browser } from '@infra/browser'
import { ApplicationLogger } from '@localtypes/logger.type'
import { Scraper } from '@localtypes/scraper.type'
import { inject, injectable } from 'tsyringe'

@injectable()
export class NuuvemScraper implements Scraper {
  constructor(
    private browser: Browser,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  async getGamePrice(gameUrl: string): Promise<number> {
    this.logger.info('[NuuvemScraper] getting a page')
    const page = await this.browser.getPage()

    try {
      this.logger.info(`[NuuvemScraper] navigating to ${gameUrl}`)
      await page.goto(gameUrl, { waitUntil: 'domcontentloaded' })

      this.logger.info('[NuuvemScraper] waiting for the page selector')
      await page.waitForSelector('span.product-price--val')

      const price = await page
        .locator('span.product-price--val')
        .evaluateAll((elements: HTMLDivElement[]) => {
          const firstOcurrence = elements.at(0)
          if (firstOcurrence && firstOcurrence.textContent) {
            firstOcurrence.removeChild(firstOcurrence.children[0]) // removes old price if the game is on sale
            return firstOcurrence.textContent
          }
          return undefined
        })

      if (price) return Number(price.replace('R$', '').replace(',', '.').trim())

      this.logger.error(`[NuuvemScraper] no price found for ${gameUrl}`)
      throw new Error('Game price not found')
    } finally {
      this.logger.info('[NuuvemScraper] closing the page')
      await page.close()
      this.logger.info('[NuuvemScraper] the page was closed')
    }
  }
}
