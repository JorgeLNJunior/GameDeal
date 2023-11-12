import { DatabaseService } from '@database/database.service'
import { randomUUID } from 'crypto'
import { container } from 'tsyringe'

import { RemoveIgnoredGamesRepository } from './removeIgnoredGames.repository'

describe('RemoveIgnoredGamesRepository', () => {
  let repository: RemoveIgnoredGamesRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new RemoveIgnoredGamesRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await db.disconnect()
  })

  it('should remove a game from the ignore list', async () => {
    const id = randomUUID()
    const title = 'GRIS'

    const client = db.getClient()
    await client.insertInto('game_ignore_list').values({ id, title }).execute()

    await repository.remove(id)

    const result = await client
      .selectFrom('game_ignore_list')
      .select(['id'])
      .executeTakeFirst()

    expect(result).toBeUndefined()
  })
})
