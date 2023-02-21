import { injectable } from 'tsyringe'

import { GameRepository } from '../http/modules/game/game.repository'
import { SteamScraper } from '../scrapers/steam.scraper'
import { ScrapeGamePriceData } from './game.queue'

@injectable()
export class GameJobProcessor {
  /**
   * Process all game related jobs from the game queue.
   *
   * @param {SteamScraper} steamScraper An instance of `SteamScraper`.
   * @param {GameRepository} gameRepository An instance of `GameRepository`.
   */
  constructor(
    private steamScraper: SteamScraper,
    private gameRepository: GameRepository
  ) {}

  /**
   * Scrapes and saves the current game price.
   *
   * @param {ScrapeGamePriceData} data The game data.
   * @returns {Promise<void>}
   */
  async scrapePrice(data: ScrapeGamePriceData): Promise<void> {
    const price = await this.steamScraper.getGamePrice(data.gameUrl)
    await this.gameRepository.insertPrice(data.gameId, price)
  }
}
