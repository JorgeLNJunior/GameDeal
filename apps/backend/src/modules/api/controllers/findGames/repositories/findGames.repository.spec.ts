import { DatabaseService } from '@database/database.service'
import { GameBuilder, GamePriceBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { FindGamesRepository } from './findGames.repository'

describe('FindGamesRepository', () => {
  let repository: FindGamesRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new FindGamesRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a list of games', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const games = await repository.find({})

    expect(games.results[0].id).toBe(game.id)
    expect(games.results[0].title).toBe(game.title)
    expect(games.results[0].steam_url).toBe(game.steam_url)
    expect(games.results[0].nuuvem_url).toBe(game.nuuvem_url)
  })

  it('should return a list of games filtered by title', async () => {
    const game = new GameBuilder().withTitle('Darkest Dungeon').build()
    const game2 = new GameBuilder().withTitle('Stray').build()
    const price = new GamePriceBuilder().withGame(game.id).build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game').values(game2).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const games = await repository.find({ title: game.title })

    expect(games.results.length).toBe(1)
    expect(games.results[0].title).toBe(game.title)
  })

  it('should return a list of games limited by query', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const games = await repository.find({ limit: '1' })

    expect(games.results[0].id).toBe(game.id)
  })

  it('should return a list of games filtered by page', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const games = await repository.find({ page: '1' })

    expect(games.results[0].id).toBe(game.id)
  })

  it('should return a list of games filtered by asc order', async () => {
    const game = new GameBuilder().withTitle('Cyberpunk 2077').build()
    const game2 = new GameBuilder().withTitle('Mortal Kombat 1').build()

    const price = new GamePriceBuilder().withGame(game.id).build()
    const price2 = new GamePriceBuilder().withGame(game2.id).build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    await db.getClient().insertInto('game').values(game2).execute()
    await db.getClient().insertInto('game_price').values(price2).execute()

    const games = await repository.find({ order: 'asc' })

    expect(games.results[0].title).toBe(game.title)
  })

  it('should return a list of games filtered by desc order', async () => {
    const game = new GameBuilder().withTitle('Cyberpunk 2077').build()
    const game2 = new GameBuilder().withTitle('Mortal Kombat 1').build()

    const price = new GamePriceBuilder().withGame(game.id).build()
    const price2 = new GamePriceBuilder().withGame(game2.id).build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    await db.getClient().insertInto('game').values(game2).execute()
    await db.getClient().insertInto('game_price').values(price2).execute()

    const games = await repository.find({ order: 'desc' })

    expect(games.results[0].title).toBe(game2.title)
  })
})
