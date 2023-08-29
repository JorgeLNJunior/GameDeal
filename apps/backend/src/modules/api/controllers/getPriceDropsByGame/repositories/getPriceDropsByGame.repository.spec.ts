import { DatabaseService } from '@database/database.service'
import { GameBuilder, GamePriceDropBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { GetPriceDropsByGameRepository } from './getPriceDropsByGame.repository'

describe('GetPriceDropsByGameRepository', () => {
  let repository: GetPriceDropsByGameRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetPriceDropsByGameRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price_drop`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a list of price drops', async () => {
    const client = db.getClient()
    const game = new GameBuilder().build()
    const priceDrop = new GamePriceDropBuilder().withGame(game.id).build()

    await client.insertInto('game').values(game).execute()
    await client.insertInto('game_price_drop').values(priceDrop).execute()

    const drops = await repository.get(game.id, {})

    expect(drops.results[0].id).toEqual(priceDrop.id)
    expect(drops.results[0].game_id).toEqual(game.id)
    expect(drops.results[0].old_price).toEqual(priceDrop.old_price?.toString())
    expect(drops.results[0].discount_price).toEqual(priceDrop.discount_price.toString())
    expect(drops.results[0].platform).toEqual(priceDrop.platform)
  })
})
