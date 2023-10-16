import { DatabaseService } from '@database/database.service'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { type IgnoreGamesOnDiscoveryDto } from '../dto/ignoreGamesOnDiscovery.dto'
import { IgnoreGamesOnDiscoveryRepository } from './ignoreGamesOnDiscovery.repository'

describe('IgnoreGamesOnDiscoveryRepository', () => {
  let repository: IgnoreGamesOnDiscoveryRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new IgnoreGamesOnDiscoveryRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should create a new game', async () => {
    const data: IgnoreGamesOnDiscoveryDto = {
      titles: ['Darkest Dungeon', 'GRIS', 'Hollow Knight']
    }

    const list = await repository.add(data)

    expect(list.length).toBe(data.titles.length)
  })
})
