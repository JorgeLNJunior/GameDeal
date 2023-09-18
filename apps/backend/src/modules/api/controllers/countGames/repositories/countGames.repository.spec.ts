import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { CountGamesRepository } from './countGames.repository'

describe('CountGamesRepository', () => {
  let repository: CountGamesRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new CountGamesRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return the number of games registered', async () => {
    const game = new GameBuilder().build()
    const game2 = new GameBuilder().withTitle('Stray').build()
    const game3 = new GameBuilder().withTitle('Fifa 23').build()

    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game').values(game2).execute()
    await db.getClient().insertInto('game').values(game3).execute()

    const total = await repository.count()

    expect(total).toBe(3)
  })
})
