import { CHEERIO_PARSER, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { HTMLParser } from '@localtypes/html.parser'
import { ApplicationLogger } from '@localtypes/logger.type'
import { Scraper } from '@localtypes/scraper.type'
import axios from 'axios'
import { inject, injectable } from 'tsyringe'

@injectable()
export class NuuvemScraper implements Scraper {
  constructor(
    @inject(CHEERIO_PARSER) private readonly parser: HTMLParser,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async getGamePrice(gameUrl: string) {
    const response = await axios.get(gameUrl)

    const priceString = this.parser
      .getElementValue(response.data, 'span.product-price--val:first', [
        '.product-price--old',
        '.currency-symbol'
      ])
      ?.replace(',', '.')
    if (!priceString) {
      this.logger.error(`[NuuvemScraper] no price found for "${gameUrl}"`)
      return null
    }

    const unavailableOptions = ['Unavailable', 'Indisponível']
    const isUnavailable = unavailableOptions.includes(priceString)
    if (isUnavailable) {
      this.logger.warn(`[NuuvemScraper] The game "${gameUrl}" is unavailable`)
      return null
    }

    const price = Number(priceString)
    if (Number.isNaN(price)) {
      this.logger.error(
        priceString,
        `[NuuvemScraper] error parsing a price for game "${gameUrl}"`
      )
      return null
    }

    return price
  }
}
