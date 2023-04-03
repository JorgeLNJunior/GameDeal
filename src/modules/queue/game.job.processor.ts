import { NotificationService } from '@infra/notification/notification.service'
import { ScrapeGamePriceData } from '@localtypes/queue.type'
import { FindGameByIdRepository } from '@modules/shared/repositories/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@modules/shared/repositories/getCurrentGamePrice.repository'
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
   * @param getCurrentGamePriceRepository - An instance of `GetCurrentGamePriceRepository`.
   * @param findGameByIdRepository - An instance of `FindGameByIdRepository`
   * @param notificationService - An instance of `NotificationService`.
   */
  constructor(
    private steamScraper: SteamScraper,
    private nuuvemScraper: NuuvemScraper,
    private insertGamePriceRepository: InsertGamePriceRepository,
    private getCurrentGamePriceRepository: GetCurrentGamePriceRepository,
    private findGameByIdRepository: FindGameByIdRepository,
    private notificationService: NotificationService
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

    const lastPrice = await this.getCurrentGamePriceRepository.getPrice(
      data.gameId
    )
    if (!lastPrice) return

    const game = await this.findGameByIdRepository.find(data.gameId)
    if (!game) return

    if (steamPrice < lastPrice.steam_price) {
      this.notificationService.notify({
        currentPrice: steamPrice,
        oldPrice: lastPrice.steam_price,
        gameTitle: game.title,
        platform: 'Steam',
        gameUrl: game.steam_url
      })
    }

    if (
      nuuvemPrice &&
      lastPrice.nuuvem_price &&
      nuuvemPrice < lastPrice.steam_price
    ) {
      this.notificationService.notify({
        currentPrice: steamPrice,
        oldPrice: lastPrice.nuuvem_price,
        gameTitle: game.title,
        platform: 'Nuuvem',
        gameUrl: game.nuuvem_url as string
      })
    }
  }
}
