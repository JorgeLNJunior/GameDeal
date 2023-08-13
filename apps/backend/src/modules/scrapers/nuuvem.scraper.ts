import { CHEERIO_PARSER, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { HTMLParser } from '@localtypes/html.parser'
import { ApplicationLogger } from '@localtypes/logger.type'
import { type Scraper } from '@localtypes/scraper.type'
import axios from 'axios'
import { inject, injectable } from 'tsyringe'

@injectable()
export class NuuvemScraper implements Scraper {
  constructor (
    @inject(CHEERIO_PARSER) private readonly parser: HTMLParser,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async getGamePrice (gameUrl: string): Promise<number | null> {
    const response = await axios.get(gameUrl)

    const priceSelector = 'span.product-price--val:first'
    const removeSelectors = ['.product-price--old', '.currency-symbol']

    const priceString = this.parser.getSelectorValue(response.data, priceSelector, removeSelectors)
    if (priceString == null) {
      this.logger.error(`[NuuvemScraper] no price found for "${gameUrl}"`)
      return null
    }

    const unavailableStrings = ['Unavailable', 'Indisponível']
    const isUnavailable = unavailableStrings.includes(priceString)
    if (isUnavailable) {
      this.logger.warn(`[NuuvemScraper] The game "${gameUrl}" is unavailable`)
      return null
    }

    const price = Number(priceString.replace(',', '.'))
    if (Number.isNaN(price)) {
      this.logger.error(priceString, `[NuuvemScraper] error parsing the price of the game "${gameUrl}"`)
      return null
    }

    return price
  }
}
