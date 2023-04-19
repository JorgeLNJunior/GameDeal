import { DatabaseService } from '@database/database.service'
import { randomUUID } from 'crypto'
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
    const game = {
      id: randomUUID(),
      title: 'Cyberpunk 2077',
      steam_url: 'https://steam.com/id',
      nuuvem_url: 'https://nuuvem.com/id',
      gamers_gate_url: 'https://gamersgate.com/id'
    }

    await db.getClient().insertInto('game').values(game).execute()

    const result = await repository.find()

    expect(result[0].id).toBe(game.id)
    expect(result[0].steam_url).toBe(game.steam_url)
    expect(result[0].nuuvem_url).toBe(game.nuuvem_url)
    expect(result[0].gamers_gate_url).toBe(game.gamers_gate_url)
  })
})
