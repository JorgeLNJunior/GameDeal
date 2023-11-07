import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@packages/testing'
import { container } from 'tsyringe'

import { DeleteGameRepository } from './deleteGame.repository'

describe('DeleteGameRepository', () => {
  let repository: DeleteGameRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new DeleteGameRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await db.disconnect()
  })

  it('should delete a game from the database', async () => {
    const client = db.getClient()
    const game = new GameBuilder().build()
    await client.insertInto('game').values(game).execute()

    await repository.delete(game.id)

    const result = await client
      .selectFrom('game')
      .select('id')
      .where('id', '=', game.id)
      .execute()

    expect(result.at(0)).toBeUndefined()
  })
})
