import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { FindGMGURLsRepository } from './findGMGUrls.repository'

describe('FindGMGURLsRepository', () => {
  let repository: FindGMGURLsRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new FindGMGURLsRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a list of green man gaming URLs', async () => {
    const game = new GameBuilder().build()

    await db.getClient().insertInto('game').values(game).execute()

    const result = await repository.find()

    expect(result[0].url).toBe(game.green_man_gaming_url)
  })
})
