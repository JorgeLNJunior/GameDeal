import { DatabaseService } from '@database/database.service'
import { randomUUID } from 'crypto'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { IsGameExistRepository } from './isGameExist.repository'

describe('IsGameExistRepository', () => {
  let repository: IsGameExistRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new IsGameExistRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return true if a game exist', async () => {
    const game = {
      id: randomUUID(),
      title: 'God of War',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url'
    }
    await db.getClient().insertInto('game').values(game).execute()

    const isGameExist = await repository.get(game.id)

    expect(isGameExist).toBe(true)
  })

  it('should return false if a game does not exist', async () => {
    const isGameExist = await repository.get('invalid-id')

    expect(isGameExist).toBe(false)
  })
})
