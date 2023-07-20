import { DatabaseService } from '@database/database.service'
import { GameBuilder, GamePriceBuilder } from '@packages/testing'
import type { GamePrice } from '@shared/types'
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
      .withNuuvemPrice(45.99)
      .build()
    const price2 = new GamePriceBuilder()
      .withGame(game.id)
      .withSteamPrice(85.99)
      .withNuuvemPrice(74.99)
      .build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()
    await db.getClient().insertInto('game_price').values(price2).execute()

    const data = await repository.get(game.id)

    expect((data as GamePrice).id).toBe(price.id)
    expect((data as GamePrice).game_id).toBe(price.game_id)
    expect((data as GamePrice).steam_price).toBe(String(price.steam_price))
    expect((data as GamePrice).nuuvem_price).toBe(String(price.nuuvem_price))
  })
})
