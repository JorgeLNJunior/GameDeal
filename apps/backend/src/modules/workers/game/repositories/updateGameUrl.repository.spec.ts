import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@packages/testing'
import { container } from 'tsyringe'

import { UpdateGameUrlRepository } from './updateGameUrl.repository'

describe('UpdateGameUrlRepository', () => {
  let repository: UpdateGameUrlRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new UpdateGameUrlRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await db.getClient().deleteFrom('game').execute()
    await db.disconnect()
  })

  it('should update the nuuvem url', async () => {
    const client = db.getClient()

    const game = new GameBuilder().build()
    const url = 'https://www.nuuvem.com/br-en/item/god-of-war'

    await client.insertInto('game').values(game).execute()

    await repository.update(game.id, { nuuvem_url: url })

    const updatedGame = await client
      .selectFrom('game')
      .select('nuuvem_url')
      .where('id', '=', game.id)
      .executeTakeFirstOrThrow()

    expect(updatedGame.nuuvem_url).toBe(url)
  })

  it('should update the green man gaming url', async () => {
    const client = db.getClient()

    const game = new GameBuilder().build()
    const url = 'https://www.greenmangaming.com/games/god-of-war-pc'

    await client.insertInto('game').values(game).execute()

    await repository.update(game.id, { green_man_gaming_url: url })

    const updatedGame = await client
      .selectFrom('game')
      .select('green_man_gaming_url')
      .where('id', '=', game.id)
      .executeTakeFirstOrThrow()

    expect(updatedGame.green_man_gaming_url).toBe(url)
  })
})
