import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { FindGameScraperDataRepository } from './findGameScraperData.repository'

describe('FindGameScraperDataRepository', () => {
  let repository: FindGameScraperDataRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new FindGameScraperDataRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a object with the game id, steam_url and nuuvem_url', async () => {
    const game = new GameBuilder().build()

    await db.getClient().insertInto('game').values(game).execute()

    const result = await repository.find()

    expect(result[0].id).toBe(game.id)
    expect(result[0].steam_url).toBe(game.steam_url)
    expect(result[0].nuuvem_url).toBe(game.nuuvem_url)
  })
})
