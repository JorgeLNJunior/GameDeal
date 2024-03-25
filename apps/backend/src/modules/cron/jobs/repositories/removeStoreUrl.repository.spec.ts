import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@packages/testing'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { RemoveStoreURLRepository } from './removeStoreUrl.repository'

describe('RemoveStoreURLRepository', () => {
  let repository: RemoveStoreURLRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new RemoveStoreURLRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should remove the nuuvem url from a game', async () => {
    const game = new GameBuilder().build()

    await db.getClient().insertInto('game').values(game).execute()

    await repository.remove(game.id, true, false)

    const result = await db.getClient()
      .selectFrom('game')
      .select(['nuuvem_url', 'green_man_gaming_url'])
      .where('id', '=', game.id)
      .executeTakeFirst()

    expect(result?.nuuvem_url).toBe(null)
    expect(result?.green_man_gaming_url).not.toBe(null)
  })

  it('should remove the green man gaming url from a game', async () => {
    const game = new GameBuilder().build()

    await db.getClient().insertInto('game').values(game).execute()

    await repository.remove(game.id, false, true)

    const result = await db.getClient()
      .selectFrom('game')
      .select(['nuuvem_url', 'green_man_gaming_url'])
      .where('id', '=', game.id)
      .executeTakeFirst()

    expect(result?.green_man_gaming_url).toBe(null)
    expect(result?.nuuvem_url).not.toBe(null)
  })
})
