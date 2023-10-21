import { CHEERIO_PARSER, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { AxiosService } from '@infra/axios.service'
import { HTMLParser } from '@localtypes/html.parser'
import { ApplicationLogger } from '@localtypes/logger.type'
import type { GamePriceScraper } from '@localtypes/scraper.type'
import { inject, injectable } from 'tsyringe'

import { PriceFormater } from '../formaters/price.formater'

@injectable()
export class GreenManGamingPriceScraper implements GamePriceScraper {
  private readonly formater = new PriceFormater()

  constructor (
    @inject(CHEERIO_PARSER) private readonly parser: HTMLParser,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger,
    private readonly axios: AxiosService
  ) {}

  async getGamePrice (gameUrl: string): Promise<number | null> {
    const data = await this.axios.get<string>(gameUrl, {
      headers: {
        // Request Brazilian prices.
        Cookie: 'CountryKey=BR; GlobalCacheKey=LoggedOut:BR:VIP Visitor GroupFalse'
      }
    })

    const priceSelector = 'gmgprice.current-price:first'

    const priceString = this.parser.getSelectorValue(data, priceSelector)
    if (priceString == null) {
      this.logger.warn(`[GreenManGamingPriceScraper] no price found for "${gameUrl}"`)
      return null
    }

    const price = Number(this.formater.removeCurrency(priceString))
    if (Number.isNaN(price)) {
      this.logger.error(`[GreenManGamingPriceScraper] error parsing a price for game "${gameUrl}"`)
      return null
    }

    return price
  }
}
