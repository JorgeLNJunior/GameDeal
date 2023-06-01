import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@testing/builders/game.builder'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { InsertGamePriceRepository } from './insertGamePrice.repository'

describe('InsertGamePriceRepository', () => {
  let repository: InsertGamePriceRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new InsertGamePriceRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should insert a new game price', async () => {
    const game = new GameBuilder().build()

    await db.getClient().insertInto('game').values(game).execute()

    const price = await repository.insert(game.id, {
      steam_price: 120.5,
      nuuvem_price: 110.99
    })

    expect(price.steam_price).toBe('120.50')
    expect(price.nuuvem_price).toBe('110.99')
  })
})
