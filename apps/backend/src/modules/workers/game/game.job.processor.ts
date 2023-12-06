import { QueueJobName, type GamePriceScraperData } from '@localtypes/queue.type'
import type { GamePrice } from '@packages/types'
import { NotificationQueue } from '@queue/notification.queue'
import { GreenManGamingPriceScraper } from '@scrapers/price/greenManGamingPrice.scraper'
import { NuuvemPriceScraper } from '@scrapers/price/nuuvemPrice.scraper'
import { SteamPriceScraper } from '@scrapers/price/steamPrice.scraper'
import { FindGameByIdRepository } from '@shared/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@shared/getCurrentGamePrice.repository'
import { injectable } from 'tsyringe'

import { InsertGamePriceRepository } from './repositories/insertGamePrice.repository'
import { InsertPriceDropRepository } from './repositories/insertPriceDrop.repository'
import { Store } from '@localtypes/notifier.type'

@injectable()
export class GameJobProcessor {
  constructor (
    private readonly steamScraper: SteamPriceScraper,
    private readonly nuuvemPriceScraper: NuuvemPriceScraper,
    private readonly gmgScraper: GreenManGamingPriceScraper,
    private readonly insertGamePriceRepository: InsertGamePriceRepository,
    private readonly insertPriceDropRepository: InsertPriceDropRepository,
    private readonly getCurrentGamePriceRepository: GetCurrentGamePriceRepository,
    private readonly findGameByIdRepository: FindGameByIdRepository,
    private readonly notificationQueue: NotificationQueue
  ) {}

  /**
   * Scrapes and saves the current game price.
   *
   * Notifies if the current price is lower than the latest registered.
   * @param data - The game data.
   */
  async scrapePrice (data: GamePriceScraperData): Promise<void> {
    let currentNuuvemPrice = null
    let currentGMGPrice = null

    const currentSteamPrice = await this.steamScraper.getGamePrice(data.steamUrl)
    if (currentSteamPrice === null) return

    const hasNuuvemUrl = data.nuuvemUrl
    if (hasNuuvemUrl !== null) {
      currentNuuvemPrice = await this.nuuvemPriceScraper.getGamePrice(data.nuuvemUrl as string)
    }

    const hasGMGUrl = data.greenManGamingUrl
    if (hasGMGUrl !== null) {
      currentGMGPrice = await this.gmgScraper.getGamePrice(data.greenManGamingUrl as string)
    }

    const lastRegisteredPrice = await this.getCurrentGamePriceRepository.getPrice(data.gameId)

    await this.insertGamePriceRepository.insert(data.gameId, {
      steam_price: currentSteamPrice,
      nuuvem_price: currentNuuvemPrice,
      green_man_gaming_price: currentGMGPrice
    })

    if (lastRegisteredPrice == null) return

    const game = await this.findGameByIdRepository.find(data.gameId)
    if (game == null) return

    const notifySteam = this.isSteamPriceLower(lastRegisteredPrice, {
      steam: currentSteamPrice,
      nuuvem: currentNuuvemPrice,
      greenManGaming: currentGMGPrice
    })

    if (notifySteam) {
      await this.insertPriceDropRepository.insert({
        game_id: game.id,
        old_price: lastRegisteredPrice.steam_price,
        discount_price: currentSteamPrice,
        platform: 'Steam'
      })
      await this.notificationQueue.add(
        QueueJobName.NOTIFY_PRICE_DROP,
        {
        currentPrice: currentSteamPrice,
        oldPrice: lastRegisteredPrice.steam_price,
        gameTitle: game.title,
        store: Store.STEAM,
        gameUrl: game.steam_url
      }); return
    }

    const notifyNuuvem = this.isNuuvemPriceLower(lastRegisteredPrice, {
      steam: currentSteamPrice,
      nuuvem: currentNuuvemPrice,
      greenManGaming: currentGMGPrice
    })

    if (notifyNuuvem) {
      await this.insertPriceDropRepository.insert({
        game_id: game.id,
        old_price: lastRegisteredPrice.nuuvem_price,
        discount_price: currentNuuvemPrice as number,
        platform: 'Nuuvem'
      })
      await this.notificationQueue.add(
        QueueJobName.NOTIFY_PRICE_DROP,
        {
        currentPrice: currentNuuvemPrice as number,
        oldPrice: lastRegisteredPrice.nuuvem_price as number,
        gameTitle: game.title,
        store: Store.NUUVEM,
        gameUrl: game.nuuvem_url as string
      }); return
    }

    const notifyGMG = this.isGreenManGamingPriceLower(lastRegisteredPrice, {
      steam: currentSteamPrice,
      nuuvem: currentNuuvemPrice,
      greenManGaming: currentGMGPrice
    })

    if (notifyGMG) {
      await this.insertPriceDropRepository.insert({
        game_id: game.id,
        old_price: lastRegisteredPrice.green_man_gaming_price,
        discount_price: currentGMGPrice as number,
        platform: 'Green Man Gaming'
      })
      await this.notificationQueue.add(
        QueueJobName.NOTIFY_PRICE_DROP,
        {
        currentPrice: currentGMGPrice as number,
        oldPrice: lastRegisteredPrice.green_man_gaming_price as number,
        gameTitle: game.title,
        store: Store.GREEN_MAN_GAMMING,
        gameUrl: game.green_man_gaming_url as string
      })
    }
  }

  /**
   * Returns true if the current steam price is lower than all other current ans last prices.
   *
   * @param lastPrices - The last registered prices in the database.
   * @param currentPrices - Current prices.
   */
  private isSteamPriceLower (
    lastPrices: GamePrice,
    currentPrices: CurrentPrices
  ): boolean {
    // prevent endless null checks
    if (lastPrices.nuuvem_price == null) lastPrices.nuuvem_price = Infinity
    if (lastPrices.green_man_gaming_price == null) lastPrices.green_man_gaming_price = Infinity
    if (currentPrices.nuuvem == null) currentPrices.nuuvem = Infinity
    if (currentPrices.greenManGaming == null) currentPrices.greenManGaming = Infinity

    const minCurrent = Math.min(currentPrices.nuuvem, currentPrices.greenManGaming)
    const minLast = Math.min(lastPrices.nuuvem_price, lastPrices.green_man_gaming_price, lastPrices.steam_price)

    if (
      currentPrices.steam < minCurrent &&
      currentPrices.steam < minLast
    ) return true

    return false
  }

  /**
   * Returns true if the current nuuvem price is lower than all other current ans last prices.
   *
   * @param lastPrices - The last registered prices in the database.
   * @param currentPrices - Current prices.
   */
  private isNuuvemPriceLower (
    lastPrices: GamePrice,
    currentPrices: CurrentPrices
  ): boolean {
    // prevent endless null checks
    if (lastPrices.nuuvem_price == null) lastPrices.nuuvem_price = Infinity
    if (lastPrices.green_man_gaming_price == null) lastPrices.green_man_gaming_price = Infinity
    if (currentPrices.greenManGaming == null) currentPrices.greenManGaming = Infinity

    if (currentPrices.nuuvem == null) return false
    if (lastPrices.nuuvem_price == null) return false

    const minCurrent = Math.min(currentPrices.steam, currentPrices.greenManGaming)
    const minLast = Math.min(lastPrices.steam_price, lastPrices.green_man_gaming_price, lastPrices.nuuvem_price)

    if (
      currentPrices.nuuvem < minCurrent &&
      currentPrices.nuuvem < minLast
    ) return true

    return false
  }

  /**
   * Returns true if the current grren man gaming price is lower than all other current ans last prices.
   *
   * @param lastPrices - The last registered prices in the database.
   * @param currentPrices - Current prices.
   */
  private isGreenManGamingPriceLower (
    lastPrices: GamePrice,
    currentPrices: CurrentPrices
  ): boolean {
    // prevent endless null checks
    if (lastPrices.nuuvem_price == null) lastPrices.nuuvem_price = Infinity
    if (lastPrices.green_man_gaming_price == null) lastPrices.green_man_gaming_price = Infinity
    if (currentPrices.nuuvem == null) currentPrices.nuuvem = Infinity

    if (currentPrices.greenManGaming == null) return false
    if (lastPrices.green_man_gaming_price == null) return false

    const minCurrent = Math.min(currentPrices.steam, currentPrices.nuuvem)
    const minLast = Math.min(lastPrices.steam_price, lastPrices.green_man_gaming_price, lastPrices.nuuvem_price)

    if (
      currentPrices.greenManGaming < minCurrent &&
      currentPrices.greenManGaming < minLast
    ) return true

    return false
  }
}

interface CurrentPrices {
  steam: number
  nuuvem: number | null
  greenManGaming: number | null
}
