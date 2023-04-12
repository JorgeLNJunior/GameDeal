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
   * Notifies if the current price is lower than the latest registered.
   *
   * @param data - The game data.
   */
  async scrapePrice(data: ScrapeGamePriceData): Promise<void> {
    let currentNuuvemPrice = null

    const currentSteamPrice = await this.steamScraper.getGamePrice(
      data.steamUrl
    )

    const hasNuuvemUrl = data.nuuvemUrl
    if (hasNuuvemUrl) {
      currentNuuvemPrice = await this.nuuvemScraper.getGamePrice(
        data.nuuvemUrl as string
      )
    }

    await this.insertGamePriceRepository.insert(data.gameId, {
      steam_price: currentSteamPrice,
      nuuvem_price: currentNuuvemPrice
    })

    const lastestRegistredPrice =
      await this.getCurrentGamePriceRepository.getPrice(data.gameId)
    if (!lastestRegistredPrice) return // returns if there's no price registered

    const game = await this.findGameByIdRepository.find(data.gameId)
    if (!game) return

    const isCurrentSteamPriceLower =
      currentSteamPrice < lastestRegistredPrice.steam_price

    if (isCurrentSteamPriceLower) {
      this.notificationService.notify({
        currentPrice: currentSteamPrice,
        oldPrice: lastestRegistredPrice.steam_price,
        gameTitle: game.title,
        platform: 'Steam',
        gameUrl: game.steam_url
      })
    }

    const isNuuvemPriceLowerThanSteam =
      currentNuuvemPrice &&
      lastestRegistredPrice.nuuvem_price &&
      currentNuuvemPrice < lastestRegistredPrice.steam_price &&
      currentNuuvemPrice < lastestRegistredPrice.nuuvem_price

    if (isNuuvemPriceLowerThanSteam) {
      this.notificationService.notify({
        currentPrice: currentNuuvemPrice as number,
        oldPrice: lastestRegistredPrice.nuuvem_price as number,
        gameTitle: game.title,
        platform: 'Nuuvem',
        gameUrl: game.nuuvem_url as string
      })
    }
  }
}
