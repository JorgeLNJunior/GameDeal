import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import type { ScrapeGamePriceData } from '@localtypes/queue.type'
import { NotificationQueue } from '@queue/notification.queue'
import { NuuvemScraper } from '@scrapers/nuuvem.scraper'
import { SteamScraper } from '@scrapers/steam.scraper'
import { FindGameByIdRepository } from '@shared/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@shared/getCurrentGamePrice.repository'
import { inject, injectable } from 'tsyringe'

import { InsertGamePriceRepository } from './repositories/insertGamePrice.repository'

@injectable()
export class GameJobProcessor {
  constructor (
    private readonly steamScraper: SteamScraper,
    private readonly nuuvemScraper: NuuvemScraper,
    private readonly insertGamePriceRepository: InsertGamePriceRepository,
    private readonly getCurrentGamePriceRepository: GetCurrentGamePriceRepository,
    private readonly findGameByIdRepository: FindGameByIdRepository,
    private readonly notificationQueue: NotificationQueue,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  /**
   * Scrapes and saves the current game price.
   *
   * Notifies if the current price is lower than the latest registered.
   * @param data - The game data.
   */
  async scrapePrice (data: ScrapeGamePriceData): Promise<void> {
    let currentNuuvemPrice = null

    const currentSteamPrice = await this.steamScraper.getGamePrice(
      data.steamUrl
    )

    const hasNuuvemUrl = data.nuuvemUrl
    if (hasNuuvemUrl !== null) {
      currentNuuvemPrice = await this.nuuvemScraper
        .getGamePrice(data.nuuvemUrl as string)
    }

    if (currentSteamPrice === null) return
    const game = await this.findGameByIdRepository.find(data.gameId)
    if (game == null) return

    const lastRegisteredPrice =
      await this.getCurrentGamePriceRepository.getPrice(data.gameId)

    await this.insertGamePriceRepository.insert(data.gameId, {
      steam_price: currentSteamPrice,
      nuuvem_price: currentNuuvemPrice
    })

    // needs rewrite, i coudn't find a cleaner solution.
    // should notify if current price at steam or nuuvem
    // is lower than last registered price (both platforms).
    if (
      lastRegisteredPrice !== undefined &&
      currentNuuvemPrice !== null &&
      lastRegisteredPrice.nuuvem_price !== null
    ) {
      const isNuuvemPriceLowest =
        currentNuuvemPrice <
        Math.min(
          lastRegisteredPrice.nuuvem_price,
          lastRegisteredPrice.steam_price,
          currentSteamPrice
        )
      if (isNuuvemPriceLowest) {
        await this.notificationQueue.add({
          currentPrice: currentNuuvemPrice,
          oldPrice: lastRegisteredPrice.nuuvem_price,
          gameTitle: game.title,
          platform: 'Nuuvem',
          gameUrl: game.nuuvem_url as string
        }); return
      }

      const isSteamPriceLowest =
        currentSteamPrice <
        Math.min(
          lastRegisteredPrice.nuuvem_price,
          lastRegisteredPrice.steam_price,
          currentNuuvemPrice
        )
      if (isSteamPriceLowest) {
        await this.notificationQueue.add({
          currentPrice: currentSteamPrice,
          oldPrice: lastRegisteredPrice.steam_price,
          gameTitle: game.title,
          platform: 'Steam',
          gameUrl: game.steam_url
        }); return
      }
    }
    if (
      (lastRegisteredPrice !== undefined) &&
      currentSteamPrice < lastRegisteredPrice.steam_price
    ) {
      await this.notificationQueue.add({
        currentPrice: currentSteamPrice,
        oldPrice: lastRegisteredPrice.steam_price,
        gameTitle: game.title,
        platform: 'Steam',
        gameUrl: game.steam_url
      })
    }
  }
}
