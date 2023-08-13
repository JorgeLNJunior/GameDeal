import { CHEERIO_PARSER, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { HTMLParser } from '@localtypes/html.parser'
import { ApplicationLogger } from '@localtypes/logger.type'
import type { Scraper } from '@localtypes/scraper.type'
import axios from 'axios'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GreenManGamingScraper implements Scraper {
  constructor (
    @inject(CHEERIO_PARSER) private readonly parser: HTMLParser,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async getGamePrice (gameUrl: string): Promise<number | null> {
    const { data } = await axios.get(gameUrl, {
      headers: {
        // Request Brazilian prices.
        Cookie: 'CountryKey=BR; GlobalCacheKey=LoggedOut:BR:VIP Visitor GroupFalse'
      }
    })

    const priceSelector = 'gmgprice.current-price:first'

    const priceString = this.parser.getSelectorValue(data, priceSelector)
    if (priceString == null) {
      this.logger.error(`[GreenManGamingScraper] no price found for "${gameUrl}"`)
      return null
    }

    const price = Number(priceString.replace('R$', '').replace(',', '.'))
    if (Number.isNaN(price)) {
      this.logger.error(`[GreenManGamingScraper] error parsing a price for game "${gameUrl}"`)
      return null
    }

    return price
  }
}
