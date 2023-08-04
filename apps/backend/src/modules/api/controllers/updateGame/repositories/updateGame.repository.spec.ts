import ConfigService from '@config/config.service'
import { DatabaseService } from '@database/database.service'
import { PinoLogger } from '@infra/pino.logger'
import { GameBuilder } from '@packages/testing'
import { sql } from 'kysely'

import { type UpdateGameDTO } from '../dto/updateGame.dto'
import { UpdateGameRepository } from './updateGame.repository'

describe('UpdateGameRepository', () => {
  let repository: UpdateGameRepository
  let db: DatabaseService

  beforeEach(async () => {
    const logger = new PinoLogger()
    const config = new ConfigService(logger)
    db = new DatabaseService(config, logger)
    repository = new UpdateGameRepository(db)
    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE from game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should update a game', async () => {
    const game = new GameBuilder().build()
    await db.getClient().insertInto('game').values(game).execute()

    const data: UpdateGameDTO = {
      title: 'title',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      green_man_gaming_url: 'green_man_gaming_url'
    }
    const result = await repository.update(game.id, data)

    expect(result?.title).toBe(data.title)
    expect(result?.steam_url).toBe(data.steam_url)
    expect(result?.nuuvem_url).toBe(data.nuuvem_url)
  })
})
