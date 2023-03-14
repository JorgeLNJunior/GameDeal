import { ScrapeGamePriceData } from '@localtypes/queue.type'
import { NuuvemScraper } from '@scrapers/nuuvem.scraper'
import { SteamScraper } from '@scrapers/steam.scraper'
import { injectable } from 'tsyringe'

import { InsertGamePriceRepository } from './repositories/insertGamePrice.repository'

@injectable()
export class GameJobProcessor {
  /**
   * Process all game related jobs from the game queue.
   *
   * @param steamScraper - An instance of `SteamScraper`.
   * @param nuuvemScraper - An instance of `NuuvemScraper`.
   * @param insertGamePriceRepository - An instance of `InsertGamePriceRepository`.
   */
  constructor(
    private steamScraper: SteamScraper,
    private nuuvemScraper: NuuvemScraper,
    private insertGamePriceRepository: InsertGamePriceRepository
  ) {}

  /**
   * Scrapes and saves the current game price.
   *
   * @param data - The game data.
   */
  async scrapePrice(data: ScrapeGamePriceData): Promise<void> {
    let nuuvemPrice = null

    const steamPrice = await this.steamScraper.getGamePrice(data.steamUrl)

    if (data.nuuvemUrl) {
      nuuvemPrice = await this.nuuvemScraper.getGamePrice(data.nuuvemUrl)
    }

    await this.insertGamePriceRepository.insert(data.gameId, {
      steam_price: steamPrice,
      nuuvem_price: nuuvemPrice
    })
  }
}
