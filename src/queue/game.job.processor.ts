import { injectable } from 'tsyringe'

import { GameRepository } from '../http/modules/game/game.repository'
import { SteamScraper } from '../scrapers/steam.scraper'
import { ScrapeGamePriceData } from './game.queue'

@injectable()
export class GameJobProcessor {
  constructor(
    private steamScraper: SteamScraper,
    private gameRepository: GameRepository
  ) {}

  /**
   * Scrape and save the current game price.
   *
   * @param {ScrapeGamePriceData} data The game data.
   * @returns {Promise<void>}
   */
  async scrapePrice(data: ScrapeGamePriceData): Promise<void> {
    const price = await this.steamScraper.getGamePrice(data.gameUrl)
    await this.gameRepository.insertPrice(data.gameId, price)
  }
}
