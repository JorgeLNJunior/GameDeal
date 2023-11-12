import { DatabaseService } from '@database/database.service'
import { randomUUID } from 'crypto'
import { container } from 'tsyringe'

import { IsIgnoredGameExistsRepository } from './isIgnoredGameExists.repository'

describe('IsIgnoredGameExistsRepository', () => {
  let repository: IsIgnoredGameExistsRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new IsIgnoredGameExistsRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await db.getClient().deleteFrom('game_ignore_list').execute()
    await db.disconnect()
  })

  it('should return true if the game is in the ignore list', async () => {
    const id = randomUUID()
    const title = 'GRIS'

    const client = db.getClient()
    await client.insertInto('game_ignore_list').values({ id, title }).execute()

    const result = await repository.exists(id)

    expect(result).toBe(true)
  })

  it('should return false if the game is not in the ignore list', async () => {
    const id = randomUUID()

    const result = await repository.exists(id)

    expect(result).toBe(false)
  })
})
