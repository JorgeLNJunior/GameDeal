import { type NotifyPriceDropData } from '@localtypes/notifier.type'
import { QueueJobName } from '@localtypes/queue.type'
import { GameBuilder, GamePriceBuilder, GamePriceDropBuilder } from '@packages/testing'
import { NotificationQueue } from '@queue/notification.queue'
import { GreenManGamingPriceScraper } from '@scrapers/price/greenManGamingPrice.scraper'
import { NuuvemPriceScraper } from '@scrapers/price/nuuvemPrice.scraper'
import { SteamPriceScraper } from '@scrapers/price/steamPrice.scraper'
import { FindGameByIdRepository } from '@shared/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@shared/getCurrentGamePrice.repository'
import { container } from 'tsyringe'

import { GameJobProcessor } from './game.job.processor'
import { InsertGamePriceRepository } from './repositories/insertGamePrice.repository'
import { InsertPriceDropRepository, type PriceDropInsertData } from './repositories/insertPriceDrop.repository'

describe('GameJobProcessor', () => {
  let job: GameJobProcessor
  let steamScraper: SteamPriceScraper
  let nuuvemPriceScraper: NuuvemPriceScraper
  let gmgScraper: GreenManGamingPriceScraper
  let insertPriceRepo: InsertGamePriceRepository
  let insertPriceDropRepo: InsertPriceDropRepository
  let getPriceRepo: GetCurrentGamePriceRepository
  let findGameByIdRepo: FindGameByIdRepository
  let notificationQueue: NotificationQueue

  beforeEach(async () => {
    steamScraper = container.resolve(SteamPriceScraper)
    nuuvemPriceScraper = container.resolve(NuuvemPriceScraper)
    gmgScraper = container.resolve(GreenManGamingPriceScraper)
    insertPriceRepo = container.resolve(InsertGamePriceRepository)
    insertPriceDropRepo = container.resolve(InsertPriceDropRepository)
    getPriceRepo = container.resolve(GetCurrentGamePriceRepository)
    findGameByIdRepo = container.resolve(FindGameByIdRepository)
    notificationQueue = container.resolve(NotificationQueue)
    job = new GameJobProcessor(
      steamScraper,
      nuuvemPriceScraper,
      gmgScraper,
      insertPriceRepo,
      insertPriceDropRepo,
      getPriceRepo,
      findGameByIdRepo,
      notificationQueue
    )
  })

  afterEach(() => jest.clearAllMocks())

  it('should notify if the current steam price is lower than the latest registered', async () => {
    const currentSteamPrice = 10
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(20)
      .withNuuvemPrice(30)
      .withGreenManGamingPrice(35)
      .build()
    const priceDrop = new GamePriceDropBuilder()
      .withGame(game.id)
      .withStore('Steam')
      .withPreviousPrice(price.steam_price)
      .withDiscountPrice(currentSteamPrice)
      .build()

    jest.spyOn(steamScraper, 'getGamePrice').mockResolvedValueOnce(currentSteamPrice)
    jest.spyOn(nuuvemPriceScraper, 'getGamePrice').mockResolvedValueOnce(30)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const insertPriceDropSpy = jest.spyOn(insertPriceDropRepo, 'insert').mockResolvedValueOnce(priceDrop)
    const notificationSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValueOnce()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url,
      greenManGamingUrl: game.green_man_gaming_url
    })

    expect(notificationSpy).toHaveBeenCalledTimes(1)
    expect(notificationSpy).toHaveBeenCalledWith<[QueueJobName, NotifyPriceDropData]>(
      QueueJobName.NOTIFY_PRICE_DROP,
      {
        currentPrice: currentSteamPrice,
        oldPrice: price.steam_price,
        gameTitle: game.title,
        store: 'Steam',
        gameUrl: game.steam_url
      })

    expect(insertPriceDropSpy).toHaveBeenCalledTimes(1)
    expect(insertPriceDropSpy).toHaveBeenCalledWith<[PriceDropInsertData]>({
      game_id: game.id,
      previous_price: price.steam_price,
      discount_price: currentSteamPrice,
      store: 'Steam'
    })
  })

  it('should notify if the current nuuvem price is lower than the latest registered', async () => {
    const currentNuuvemPrice = 10
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(20)
      .withNuuvemPrice(30)
      .withGreenManGamingPrice(40)
      .build()
    const priceDrop = new GamePriceDropBuilder()
      .withGame(game.id)
      .withStore('Nuuvem')
      .withPreviousPrice(price.nuuvem_price as number)
      .withDiscountPrice(currentNuuvemPrice)
      .build()

    jest.spyOn(nuuvemPriceScraper, 'getGamePrice').mockResolvedValueOnce(currentNuuvemPrice)
    jest.spyOn(steamScraper, 'getGamePrice').mockResolvedValueOnce(20)
    jest.spyOn(gmgScraper, 'getGamePrice').mockResolvedValueOnce(40)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const insertPriceDropSpy = jest.spyOn(insertPriceDropRepo, 'insert').mockResolvedValueOnce(priceDrop)
    const notificationSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValueOnce()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url,
      greenManGamingUrl: game.green_man_gaming_url
    })

    expect(notificationSpy).toHaveBeenCalledTimes(1)
    expect(notificationSpy).toHaveBeenCalledWith<[QueueJobName, NotifyPriceDropData]>(
      QueueJobName.NOTIFY_PRICE_DROP,
      {
        currentPrice: currentNuuvemPrice,
        oldPrice: price.nuuvem_price,
        gameTitle: game.title,
        store: 'Nuuvem',
        gameUrl: game.nuuvem_url as string
      })

    expect(insertPriceDropSpy).toHaveBeenCalledTimes(1)
    expect(insertPriceDropSpy).toHaveBeenCalledWith<[PriceDropInsertData]>({
      game_id: game.id,
      previous_price: price.nuuvem_price,
      discount_price: currentNuuvemPrice,
      store: 'Nuuvem'
    })
  })

  it('should notify if the current green man gaming price is lower than the latest registered', async () => {
    const currentGMGPrice = 10
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(20)
      .withNuuvemPrice(30)
      .withGreenManGamingPrice(40)
      .build()
    const priceDrop = new GamePriceDropBuilder()
      .withGame(game.id)
      .withStore('Nuuvem')
      .withPreviousPrice(price.green_man_gaming_price as number)
      .withDiscountPrice(currentGMGPrice)
      .build()

    jest.spyOn(gmgScraper, 'getGamePrice').mockResolvedValueOnce(currentGMGPrice)
    jest.spyOn(steamScraper, 'getGamePrice').mockResolvedValueOnce(20)
    jest.spyOn(nuuvemPriceScraper, 'getGamePrice').mockResolvedValueOnce(30)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const insertPriceDropSpy = jest.spyOn(insertPriceDropRepo, 'insert').mockResolvedValueOnce(priceDrop)
    const notificationSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValueOnce()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url,
      greenManGamingUrl: game.green_man_gaming_url
    })

    expect(notificationSpy).toHaveBeenCalledTimes(1)
    expect(notificationSpy).toHaveBeenCalledWith<[QueueJobName, NotifyPriceDropData]>(
      QueueJobName.NOTIFY_PRICE_DROP,
      {
        currentPrice: currentGMGPrice,
        oldPrice: price.green_man_gaming_price,
        gameTitle: game.title,
        store: 'Green Man Gaming',
        gameUrl: game.green_man_gaming_url as string
      })

    expect(insertPriceDropSpy).toHaveBeenCalledTimes(1)
    expect(insertPriceDropSpy).toHaveBeenCalledWith<[PriceDropInsertData]>({
      game_id: game.id,
      previous_price: price.green_man_gaming_price,
      discount_price: currentGMGPrice,
      store: 'Green Man Gaming'
    })
  })

  it('should notify if the current steam price is lower than the latest registered (if there is steam price only)', async () => {
    const currentSteamPrice = 10
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(20)
      .withNuuvemPrice(null)
      .withGreenManGamingPrice(null)
      .build()
    const priceDrop = new GamePriceDropBuilder()
      .withGame(game.id)
      .withStore('Steam')
      .withPreviousPrice(price.steam_price)
      .withDiscountPrice(currentSteamPrice)
      .build()

    jest.spyOn(steamScraper, 'getGamePrice').mockResolvedValueOnce(currentSteamPrice)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const insertPriceDropSpy = jest.spyOn(insertPriceDropRepo, 'insert').mockResolvedValueOnce(priceDrop)
    const notificationSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValueOnce()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url,
      greenManGamingUrl: game.green_man_gaming_url
    })

    expect(notificationSpy).toHaveBeenCalledTimes(1)
    expect(notificationSpy).toHaveBeenCalledWith<[QueueJobName, NotifyPriceDropData]>(
      QueueJobName.NOTIFY_PRICE_DROP,
      {
        currentPrice: currentSteamPrice,
        oldPrice: price.steam_price,
        gameTitle: game.title,
        store: 'Steam',
        gameUrl: game.steam_url
      })

    expect(insertPriceDropSpy).toHaveBeenCalledTimes(1)
    expect(insertPriceDropSpy).toHaveBeenCalledWith<[PriceDropInsertData]>({
      game_id: game.id,
      previous_price: price.steam_price,
      discount_price: currentSteamPrice,
      store: 'Steam'
    })
  })

  it('should notify if the current nuuvem price is lower than the latest registered (if there is steam and nuuvem price only)', async () => {
    const currentNuuvemPrice = 10
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(20)
      .withNuuvemPrice(30)
      .withGreenManGamingPrice(null)
      .build()
    const priceDrop = new GamePriceDropBuilder()
      .withGame(game.id)
      .withStore('Nuuvem')
      .withPreviousPrice(price.nuuvem_price as number)
      .withDiscountPrice(currentNuuvemPrice)
      .build()

    jest.spyOn(nuuvemPriceScraper, 'getGamePrice').mockResolvedValueOnce(currentNuuvemPrice)
    jest.spyOn(steamScraper, 'getGamePrice').mockResolvedValueOnce(20)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const insertPriceDropSpy = jest.spyOn(insertPriceDropRepo, 'insert').mockResolvedValueOnce(priceDrop)
    const notificationSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValueOnce()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url,
      greenManGamingUrl: game.green_man_gaming_url
    })

    expect(notificationSpy).toHaveBeenCalledTimes(1)
    expect(notificationSpy).toHaveBeenCalledWith<[QueueJobName, NotifyPriceDropData]>(
      QueueJobName.NOTIFY_PRICE_DROP,
      {
        currentPrice: currentNuuvemPrice,
        oldPrice: price.nuuvem_price,
        gameTitle: game.title,
        store: 'Nuuvem',
        gameUrl: game.nuuvem_url as string
      })

    expect(insertPriceDropSpy).toHaveBeenCalledTimes(1)
    expect(insertPriceDropSpy).toHaveBeenCalledWith<[PriceDropInsertData]>({
      game_id: game.id,
      previous_price: price.nuuvem_price,
      discount_price: currentNuuvemPrice,
      store: 'Nuuvem'
    })
  })

  it('should notify if the current nuuvem price is lower than the latest registered (if there is steam and gmg price only)', async () => {
    const currentGMGPrice = 10
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(20)
      .withNuuvemPrice(null)
      .withGreenManGamingPrice(40)
      .build()
    const priceDrop = new GamePriceDropBuilder()
      .withGame(game.id)
      .withStore('Green Man Gaming')
      .withPreviousPrice(price.green_man_gaming_price as number)
      .withDiscountPrice(currentGMGPrice)
      .build()

    jest.spyOn(gmgScraper, 'getGamePrice').mockResolvedValueOnce(currentGMGPrice)
    jest.spyOn(steamScraper, 'getGamePrice').mockResolvedValueOnce(20)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(price)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const insertPriceDropSpy = jest.spyOn(insertPriceDropRepo, 'insert').mockResolvedValueOnce(priceDrop)
    const notificationSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValueOnce()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url,
      greenManGamingUrl: game.green_man_gaming_url
    })

    expect(notificationSpy).toHaveBeenCalledTimes(1)
    expect(notificationSpy).toHaveBeenCalledWith<[QueueJobName, NotifyPriceDropData]>(
      QueueJobName.NOTIFY_PRICE_DROP,
      {
        currentPrice: currentGMGPrice,
        oldPrice: price.green_man_gaming_price,
        gameTitle: game.title,
        store: 'Green Man Gaming',
        gameUrl: game.green_man_gaming_url as string
      })

    expect(insertPriceDropSpy).toHaveBeenCalledTimes(1)
    expect(insertPriceDropSpy).toHaveBeenCalledWith<[PriceDropInsertData]>({
      game_id: game.id,
      previous_price: price.green_man_gaming_price,
      discount_price: currentGMGPrice,
      store: 'Green Man Gaming'
    })
  })

  it('should not notify if there is no price registered', async () => {
    const currentSteamPrice = 10
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(20)
      .withNuuvemPrice(30)
      .withGreenManGamingPrice(35)
      .build()

    jest.spyOn(steamScraper, 'getGamePrice').mockResolvedValueOnce(currentSteamPrice)
    jest.spyOn(nuuvemPriceScraper, 'getGamePrice').mockResolvedValueOnce(30)
    jest.spyOn(insertPriceRepo, 'insert').mockResolvedValueOnce(price)
    jest.spyOn(getPriceRepo, 'getPrice').mockResolvedValueOnce(undefined)
    jest.spyOn(findGameByIdRepo, 'find').mockResolvedValueOnce(game)
    const insertPriceDropSpy = jest.spyOn(insertPriceDropRepo, 'insert')
    const notificationSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValueOnce()

    await job.scrapePrice({
      gameId: game.id,
      steamUrl: game.steam_url,
      nuuvemUrl: game.nuuvem_url,
      greenManGamingUrl: game.green_man_gaming_url
    })

    expect(notificationSpy).not.toHaveBeenCalled()
    expect(insertPriceDropSpy).not.toHaveBeenCalled()
  })
})
