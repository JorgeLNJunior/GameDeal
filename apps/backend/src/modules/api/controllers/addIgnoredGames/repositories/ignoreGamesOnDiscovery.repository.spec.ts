import { DatabaseService } from '@database/database.service'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { type AddIgnoredGamesDto } from '../dto/addIgnoredGames.dto'
import { AddIgnoredGamesRepository } from './addIgnoredGames.repository'

describe('IgnoreGamesOnDiscoveryRepository', () => {
  let repository: AddIgnoredGamesRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new AddIgnoredGamesRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should create a new game', async () => {
    const data: AddIgnoredGamesDto = {
      titles: ['Darkest Dungeon', 'GRIS', 'Hollow Knight']
    }

    const list = await repository.add(data)

    expect(list.length).toBe(data.titles.length)
  })
})
