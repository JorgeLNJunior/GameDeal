/* eslint-disable @typescript-eslint/naming-convention */
import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { InsertPriceDropRepository } from './insertPriceDrop.repository'
import { Store } from '@packages/types'

describe('InsertPriceDropRepository', () => {
  let repository: InsertPriceDropRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new InsertPriceDropRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price_drop`.execute(db.getClient())
    await db.disconnect()
  })

  it('should register a game price drop', async () => {
    const game = new GameBuilder().build()
    const store = Store.STEAM
    const old_price = 139.99
    const discount_price = 78.32

    await db.getClient().insertInto('game').values(game).execute()

    const price = await repository.insert({
      game_id: game.id,
      store,
      old_price,
      discount_price
    })

    expect(price.store).toBe(store)
    expect(price.old_price).toBe(old_price.toString())
    expect(price.discount_price).toBe(discount_price.toString())
  })
})
