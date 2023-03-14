import { DatabaseService } from '@database/database.service'
import { randomUUID } from 'crypto'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { FindGamesRepository } from './findGames.repository'

describe('FindGamesRepository', () => {
  let repository: FindGamesRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new FindGamesRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a list of games', async () => {
    const game = {
      id: randomUUID(),
      title: 'Cyberpunk 2077',
      steam_url: 'https://steamcommunity.com/id',
      green_man_gaming_url: 'https://www.greenmangaming.com/id',
      nuuvem_url: 'https://nuuvem.com/id'
    }
    await db.getClient().insertInto('game').values(game).execute()

    const games = await repository.find()

    expect(games[0].id).toEqual(game.id)
    expect(games[0].title).toEqual(game.title)
    expect(games[0].steam_url).toEqual(game.steam_url)
    expect(games[0].nuuvem_url).toEqual(game.nuuvem_url)
    expect(games[0].green_man_gaming_url).toEqual(game.green_man_gaming_url)
  })
})
