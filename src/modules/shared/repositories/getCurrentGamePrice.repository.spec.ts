import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@testing/builders/game.builder'
import { GamePriceBuilder } from '@testing/builders/price.builder'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { GetCurrentGamePriceRepository } from './getCurrentGamePrice.repository'

describe('GetCurrentGamePriceRepository', () => {
  let repository: GetCurrentGamePriceRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetCurrentGamePriceRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return the current game price', async () => {
    const gameData = new GameBuilder().build()
    const priceData = new GamePriceBuilder().withGame(gameData.id).build()
    await db.getClient().insertInto('game').values(gameData).execute()
    await db.getClient().insertInto('game_price').values(priceData).execute()

    const price = await repository.getPrice(gameData.id)

    expect(price?.steam_price).toBe(String(priceData.steam_price))
    expect(price?.nuuvem_price).toBe(String(priceData.nuuvem_price))
  })
})
