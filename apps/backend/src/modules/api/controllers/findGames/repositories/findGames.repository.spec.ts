import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@testing/builders/game.builder'
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
    await db.disconnect()
  })

  it('should return a list of games', async () => {
    const game = new GameBuilder().build()
    await db.getClient().insertInto('game').values(game).execute()

    const games = await repository.find({})

    expect(games.results[0].id).toEqual(game.id)
    expect(games.results[0].title).toEqual(game.title)
    expect(games.results[0].steam_url).toEqual(game.steam_url)
    expect(games.results[0].nuuvem_url).toEqual(game.nuuvem_url)
  })
})
