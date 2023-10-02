import { DatabaseService } from '@database/database.service'
import { GameBuilder, GamePriceBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { GetGamePriceHistoryRepository } from './getGamePriceHistory.repository'

describe('GetGamePriceHistoryRepository', () => {
  let repository: GetGamePriceHistoryRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetGamePriceHistoryRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a list of prices', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const data = await repository.get(game.id, {})

    expect(data.results[0].id).toBe(price.id)
    expect(data.results[0].game_id).toBe(price.game_id)
    expect(data.results[0].steam_price).toBe(String(price.steam_price))
    expect(data.results[0].nuuvem_price).toBe(String(price.nuuvem_price))
  })

  it('should return a list of prices limited by query', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const game2 = new GameBuilder().withTitle('Dark Souls').build()
    const price2 = new GamePriceBuilder().withGame(game2.id).build()
    await db.getClient().insertInto('game').values(game2).execute()
    await db.getClient().insertInto('game_price').values(price2).execute()

    const data = await repository.get(game.id, { limit: '1' })

    expect(data.results.length).toBe(1)
  })

  it('should return a list of prices filtered by page', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const data = await repository.get(game.id, { page: '1' })

    expect(data.results[0].id).toBe(price.id)
  })

  it('should return a list of prices filtered by date', async () => {
    const date = '2015-10-10'
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).withDate(date).build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const data = await repository.get(game.id, {
      startDate: date,
      endDate: date
    })

    expect(data.results[0].id).toBe(price.id)
  })

  it('should return a list of prices filtered asc order', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).withDate('2018-04-01').build()
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const game2 = new GameBuilder().withTitle('Dark Souls').build()
    const price2 = new GamePriceBuilder().withGame(game2.id).withDate('2019-03-15').build()
    await db.getClient().insertInto('game').values(game2).execute()
    await db.getClient().insertInto('game_price').values(price2).execute()

    const data = await repository.get(game.id, { order: 'asc' })

    expect(data.results[0].id).toBe(price.id)
  })

  it('should return a list of prices filtered desc order', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).withDate('2019-03-15').build()
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const game2 = new GameBuilder().withTitle('Dark Souls').build()
    const price2 = new GamePriceBuilder().withGame(game2.id).withDate('2018-04-01').build()
    await db.getClient().insertInto('game').values(game2).execute()
    await db.getClient().insertInto('game_price').values(price2).execute()

    const data = await repository.get(game.id, { order: 'desc' })

    expect(data.results[0].id).toBe(price.id)
  })
})
