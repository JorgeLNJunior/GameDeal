import { DatabaseService } from '@database/database.service'
import { GameBuilder, GamePriceBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { GetLowestPriceRepository } from './getLowestPrice.repository'

describe('GetLowestPriceRepository', () => {
  let repository: GetLowestPriceRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetLowestPriceRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a price', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(50.55)
      .withNuuvemPrice(60.99)
      .withGreenManGamingPrice(65.44)
      .build()
    const lowestPrice = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(27.55)
      .withNuuvemPrice(25.99)
      .withGreenManGamingPrice(20.25)
      .build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()
    await db.getClient().insertInto('game_price').values(lowestPrice).execute()

    const data = await repository.get(game.id)

    expect(data.steam?.price).toBe(lowestPrice.steam_price.toString())
    expect(data.nuuvem?.price).toBe(lowestPrice.nuuvem_price?.toString())
    expect(data.green_man_gaming?.price).toBe(lowestPrice.green_man_gaming_price?.toString())
  })

  it('should return the price as null if there is not price in a platform', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(50.55)
      .withNuuvemPrice(60.99)
      .withGreenManGamingPrice(null)
      .build()
    const lowestPrice = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(27.55)
      .withNuuvemPrice(25.99)
      .withGreenManGamingPrice(null)
      .build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()
    await db.getClient().insertInto('game_price').values(lowestPrice).execute()

    const data = await repository.get(game.id)

    expect(data.steam?.price).toBe(lowestPrice.steam_price.toString())
    expect(data.nuuvem?.price).toBe(lowestPrice.nuuvem_price?.toString())
    expect(data.green_man_gaming?.price).toBe(null)
  })
})
