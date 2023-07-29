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
    const steam = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(50.55)
      .withNuuvemPrice(60.99)
      .build()
    const steamLowest = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(45.99)
      .withNuuvemPrice(74.99)
      .build()
    const nuuvem = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(50.55)
      .withNuuvemPrice(45.99)
      .build()
    const nuuvemLowest = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(48.65)
      .withNuuvemPrice(40.99)
      .build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(steam).execute()
    await db.getClient().insertInto('game_price').values(steamLowest).execute()
    await db.getClient().insertInto('game_price').values(nuuvem).execute()
    await db.getClient().insertInto('game_price').values(nuuvemLowest).execute()

    const data = await repository.get(game.id)

    expect(data.steam?.steam_price).toBe(steamLowest.steam_price.toString())
    expect(data.nuuvem?.nuuvem_price).toBe(nuuvemLowest.nuuvem_price?.toString())
  })
})
