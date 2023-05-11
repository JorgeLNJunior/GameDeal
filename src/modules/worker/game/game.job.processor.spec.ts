import { PinoLogger } from '@infra/pino.logger'
import { NotificationQueue } from '@queue/notification.queue'
import { NuuvemScraper } from '@scrapers/nuuvem.scraper'
import { SteamScraper } from '@scrapers/steam.scraper'
import { FindGameByIdRepository } from '@shared/repositories/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@shared/repositories/getCurrentGamePrice.repository'
import { container } from 'tsyringe'

import { GameJobProcessor } from './game.job.processor'
import { InsertGamePriceRepository } from './repositories/insertGamePrice.repository'

describe('GameJobProcessor', () => {
  let job: GameJobProcessor
  let steamScraper: SteamScraper
  let nuuvemScraper: NuuvemScraper
  let insertPriceRepo: InsertGamePriceRepository
  let getPriceRepo: GetCurrentGamePriceRepository
  let findGameByIdRepo: FindGameByIdRepository
  let notificationQueue: NotificationQueue

  beforeEach(async () => {
    steamScraper = container.resolve(SteamScraper)
    nuuvemScraper = container.resolve(NuuvemScraper)
    insertPriceRepo = container.resolve(InsertGamePriceRepository)
    getPriceRepo = container.resolve(GetCurrentGamePriceRepository)
    findGameByIdRepo = container.resolve(FindGameByIdRepository)
    notificationQueue = container.resolve(NotificationQueue)
    job = new GameJobProcessor(
      steamScraper,
      nuuvemScraper,
      insertPriceRepo,
      getPriceRepo,
      findGameByIdRepo,
      notificationQueue,
      new PinoLogger()
    )
  })

  it('should notify if the current steam price is lower than the latest registered', async () => {
    const currentSteamPrice = 10
    const game = {
      id: 'id',
      title: 'title',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: new Date()
    }
    const price = {
      id: 'id',
      game_id: 'game_id',
      steam_price: 20,
      nuuvem_price: 30,
      created_at: new Date(),
      updated_at: null
    }
    jest
      .spyOn(steamScraper, 'getGamePrice')
      .mockResolvedValueOnce(currentSteamPrice)
    jest.spyOn(nuuvemScraper, 'getGamePrice').mockResolvedValueOnce(30)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const notificationSpy = jest
      .spyOn(notificationQueue, 'add')
      .mockResolvedValue()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url
    })

    expect(notificationSpy).toHaveBeenCalledWith({
      currentPrice: currentSteamPrice,
      oldPrice: price.steam_price,
      gameTitle: game.title,
      platform: 'Steam',
      gameUrl: game.steam_url
    })
  })

  it('should notify if the current nuuvem price is lower than the latest registered (steam and nuuvem prices)', async () => {
    const currentNuuvemPrice = 10
    const game = {
      id: 'id',
      title: 'title',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: new Date()
    }
    const price = {
      id: 'id',
      game_id: 'game_id',
      steam_price: 20,
      nuuvem_price: 30,
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(steamScraper, 'getGamePrice').mockResolvedValueOnce(20)
    jest
      .spyOn(nuuvemScraper, 'getGamePrice')
      .mockResolvedValueOnce(currentNuuvemPrice)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const notificationSpy = jest
      .spyOn(notificationQueue, 'add')
      .mockResolvedValue()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url
    })

    expect(notificationSpy).toHaveBeenCalledWith({
      currentPrice: currentNuuvemPrice,
      oldPrice: price.nuuvem_price,
      gameTitle: game.title,
      platform: 'Nuuvem',
      gameUrl: game.nuuvem_url
    })
  })

  it('should notify if the current steam price is lower than the latest registered (steam price only)', async () => {
    const currentSteamPrice = 10
    const game = {
      id: 'id',
      title: 'title',
      steam_url: 'steam_url',
      nuuvem_url: null,
      created_at: new Date(),
      updated_at: new Date()
    }
    const price = {
      id: 'id',
      game_id: 'game_id',
      steam_price: 20,
      nuuvem_price: null,
      created_at: new Date(),
      updated_at: null
    }
    jest
      .spyOn(steamScraper, 'getGamePrice')
      .mockResolvedValueOnce(currentSteamPrice)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const notificationSpy = jest
      .spyOn(notificationQueue, 'add')
      .mockResolvedValue()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url
    })

    expect(notificationSpy).toHaveBeenCalledWith({
      currentPrice: currentSteamPrice,
      oldPrice: price.steam_price,
      gameTitle: game.title,
      platform: 'Steam',
      gameUrl: game.steam_url
    })
  })
})
