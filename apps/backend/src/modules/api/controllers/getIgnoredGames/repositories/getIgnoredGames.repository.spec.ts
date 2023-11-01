import { DatabaseService } from '@database/database.service'
import { randomUUID } from 'crypto'
import { container } from 'tsyringe'

import { GetIgnoredGamesRepository } from './getIgnoredGames.repository'

describe('GetIgnoredGamesRepository', () => {
  let repository: GetIgnoredGamesRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetIgnoredGamesRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    const client = db.getClient()
    await client.deleteFrom('game_ignore_list').execute()
    await db.disconnect()
  })

  it('should return a list of ignored games', async () => {
    const id = randomUUID()
    const title = 'Alan Wake'

    await db.getClient()
      .insertInto('game_ignore_list')
      .values({ id, title })
      .execute()

    const games = await repository.get({})

    expect(games.results[0].id).toBe(id)
    expect(games.results[0].title).toBe(title)
  })

  it('should return a list of ignored games ordered by asc', async () => {
    const id = randomUUID()
    const title = 'Alan Wake'

    await db.getClient()
      .insertInto('game_ignore_list')
      .values({ id, title })
      .execute()
    await db.getClient()
      .insertInto('game_ignore_list')
      .values({ id: randomUUID(), title: 'God of War' })
      .execute()

    const games = await repository.get({ order: 'asc' })

    expect(games.results[0].id).toBe(id)
    expect(games.results[0].title).toBe(title)
  })

  it('should return a list of ignored games ordered by desc', async () => {
    const id = randomUUID()
    const title = 'God of War'

    await db.getClient()
      .insertInto('game_ignore_list')
      .values({ id, title })
      .execute()
    await db.getClient()
      .insertInto('game_ignore_list')
      .values({ id: randomUUID(), title: 'Alan Wake' })
      .execute()

    const games = await repository.get({ order: 'desc' })

    expect(games.results[0].id).toBe(id)
    expect(games.results[0].title).toBe(title)
  })
})
