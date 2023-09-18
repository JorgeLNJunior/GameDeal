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
})
