import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { IsGameAlreadyInsertedRepository } from './isGameAlreadyInserted.repository'

describe('IsGameAlreadyInsertedRepository', () => {
  let repository: IsGameAlreadyInsertedRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new IsGameAlreadyInsertedRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return true if a game is already inserted', async () => {
    const game = new GameBuilder().build()
    await db.getClient().insertInto('game').values(game).execute()

    const isAlreadyInserted = await repository.handle('God of War')
    expect(isAlreadyInserted).toBe(true)
  })

  it('should return false if a game is not inserted', async () => {
    const isAlreadyInserted = await repository.handle('Terraria')
    expect(isAlreadyInserted).toBe(false)
  })
})
