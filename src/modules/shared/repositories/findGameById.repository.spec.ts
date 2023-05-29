import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@testing/builders/game.builder'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { FindGameByIdRepository } from './findGameById.repository'

describe('FindGameByIdRepository', () => {
  let repository: FindGameByIdRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new FindGameByIdRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a game', async () => {
    const data = new GameBuilder().build()

    await db.getClient().insertInto('game').values(data).execute()

    const result = await repository.find(data.id)

    expect(result).toBeDefined()
    expect(result?.id).toBe(data.id)
    expect(result?.title).toBe(data.title)
    expect(result?.steam_url).toBe(data.steam_url)
    expect(result?.nuuvem_url).toBe(data.nuuvem_url)
  })
})
