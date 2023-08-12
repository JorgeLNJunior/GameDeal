import { CHEERIO_PARSER, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { HTMLParser } from '@localtypes/html.parser'
import { ApplicationLogger } from '@localtypes/logger.type'
import type { Scraper } from '@localtypes/scraper.type'
import axios from 'axios'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SteamScraper implements Scraper {
  constructor (
    @inject(CHEERIO_PARSER) private readonly parser: HTMLParser,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  async getGamePrice (gameUrl: string): Promise<number | null> {
    // makes steam show brazilian prices
    gameUrl += '?cc=br'

    const response = await axios.get(gameUrl, {
      headers: {
        Cookie: 'birthtime=0' // bypass age check
      }
    })

    let priceString = this.parser
      .getElementValue(
        response.data,
        'div.game_area_purchase_game_wrapper:first div.game_purchase_price',
        [
          'div.game_purchase_sub_dropdown',
          'div.master_sub_trial'
        ] // remove subscription and bundles
      )
      ?.replace('R$', '')
      .replace(',', '.')
      .trim()
    if (priceString !== undefined) {
      const price = Number(priceString)
      if (Number.isNaN(price)) {
        this.logger.error(
          priceString,
          `[SteamScraper] error parsing a price for game "${gameUrl}"`
        )
        return null
      }
      return price
    }

    priceString = this.parser
      .getElementValue(
        response.data,
        'div.game_area_purchase_game_wrapper:first div.discount_final_price',
        [
          'div.game_purchase_sub_dropdown',
          'div.master_sub_trial'
        ] // remove subscription and bundles
      )
      ?.replace('R$', '')
      .replace(',', '.')
      .trim()
    if (priceString !== undefined) {
      const price = Number(priceString)
      if (Number.isNaN(price)) {
        this.logger.error(
          priceString,
          `[SteamScraper] error parsing a price for game "${gameUrl}"`
        )
        return null
      }
      return price
    }

    this.logger.error(`[SteamScraper] no price found for "${gameUrl}"`)
    return null
  }
}
