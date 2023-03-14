import { DatabaseService } from '@database/database.service'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { AddGameDTO } from '../dto/addGame.dto'
import { AddGameRepository } from './addGame.repository'

describe('AddGameRepository', () => {
  let repository: AddGameRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new AddGameRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should create a new game', async () => {
    const data: AddGameDTO = {
      title: 'Cyberpunk 2077',
      steam_url: 'https://steamcommunity.com/id',
      green_man_gaming_url: 'https://www.greenmangaming.com/id',
      nuuvem_url: 'https://nuuvem.com/id'
    }

    const game = await repository.add(data)

    expect(game.title).toBe(data.title)
    expect(game.steam_url).toBe(data.steam_url)
  })
})
