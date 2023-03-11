import { GameRepository } from '@database/repositories/game.repository'
import { ScrapeGamePriceData } from '@localtypes/queue.type'
import { NuuvemScraper } from '@scrapers/nuuvem.scraper'
import { SteamScraper } from '@scrapers/steam.scraper'
import { injectable } from 'tsyringe'

@injectable()
export class GameJobProcessor {
  /**
   * Process all game related jobs from the game queue.
   *
   * @param steamScraper - An instance of `SteamScraper`.
   * @param nuuvemScraper - An instance of `NuuvemScraper`.
   * @param gameRepository - An instance of `GameRepository`.
   */
  constructor(
    private steamScraper: SteamScraper,
    private nuuvemScraper: NuuvemScraper,
    private gameRepository: GameRepository
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

    await this.gameRepository.insertPrice(data.gameId, {
      steam_price: steamPrice,
      nuuvem_price: nuuvemPrice
    })
  }
}
