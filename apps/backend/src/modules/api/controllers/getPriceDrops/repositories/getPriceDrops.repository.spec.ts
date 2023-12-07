import { DatabaseService } from '@database/database.service'
import { GameBuilder, GamePriceDropBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { GetPriceDropsRepository } from './getPriceDrops.repository'

describe('GetPriceDropsRepository', () => {
  let repository: GetPriceDropsRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetPriceDropsRepository(db)

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

    const drops = await repository.get({})

    expect(drops.results[0].id).toEqual(priceDrop.id)
    expect(drops.results[0].game_id).toEqual(game.id)
    expect(drops.results[0].previous_price).toEqual(priceDrop.previous_price?.toString())
    expect(drops.results[0].discount_price).toEqual(priceDrop.discount_price.toString())
    expect(drops.results[0].store).toEqual(priceDrop.store)
  })

  it('should return a list of price drops limited by query params', async () => {
    const client = db.getClient()
    const game = new GameBuilder().build()
    const priceDrop = new GamePriceDropBuilder().withGame(game.id).build()
    const priceDrop2 = new GamePriceDropBuilder().withGame(game.id).build()

    await client.insertInto('game').values(game).execute()
    await client.insertInto('game_price_drop').values(priceDrop).execute()
    await client.insertInto('game_price_drop').values(priceDrop2).execute()

    const drops = await repository.get({ limit: '1' })

    expect(drops.results.length).toEqual(1)
  })

  it('should return a list of price drops paginated by query params', async () => {
    const client = db.getClient()
    const game = new GameBuilder().build()
    const priceDrop = new GamePriceDropBuilder().withGame(game.id).build()
    const priceDrop2 = new GamePriceDropBuilder().withGame(game.id).build()

    await client.insertInto('game').values(game).execute()
    await client.insertInto('game_price_drop').values(priceDrop).execute()
    await client.insertInto('game_price_drop').values(priceDrop2).execute()

    const drops = await repository.get({ limit: '1', page: '2' })

    expect(drops.results.length).toEqual(1)
  })

  it('should return a list of price drops filtered by date', async () => {
    const client = db.getClient()
    const game = new GameBuilder().build()
    const priceDrop = new GamePriceDropBuilder().withGame(game.id).build()
    const priceDrop2 = new GamePriceDropBuilder().withGame(game.id).build()

    const date = '2015-10-19'

    await client.insertInto('game').values(game).execute()
    await client.insertInto('game_price_drop').values(priceDrop).execute()
    await client.insertInto('game_price_drop').values(priceDrop2).execute()

    await client.updateTable('game_price_drop')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .set({ date } as any)
      .where('id', '=', priceDrop.id)
      .execute()

    const drops = await repository.get({ date })

    expect(drops.results[0].id).toEqual(priceDrop.id)
  })
})
