/* eslint-disable @typescript-eslint/no-explicit-any */

import { DatabaseService } from '@database/database.service'
import { type GameIgnoreList } from '@packages/types'
import { randomUUID } from 'crypto'
import { container } from 'tsyringe'

import { type RemoveIgnoredGamesDto } from '../dto/removeIgnoredGames.dto'
import { IsIgnoredGameExistsRepository } from '../repositories/isIgnoredGameExists.repository'
import { RemoveIgnoredGamesValidator } from './removeIgnoredGames.validator'

describe('RemoveIgnoredGamesValidator', () => {
  let validator: RemoveIgnoredGamesValidator
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    const repository = new IsIgnoredGameExistsRepository(db)
    validator = new RemoveIgnoredGamesValidator(repository)

    await db.connect()
  })

  afterEach(async () => {
    await db.getClient().deleteFrom('game_ignore_list').execute()
    await db.disconnect()
  })

  it('should return true if validation succeeds', async () => {
    const data: GameIgnoreList = { id: randomUUID(), title: 'Starfield' }
    await db.getClient().insertInto('game_ignore_list').values(data).execute()

    const dto: RemoveIgnoredGamesDto = {
      ids: [data.id]
    }

    const { success, errors } = await validator.validate(dto)

    expect(success).toBe(true)
    expect(errors).toBeUndefined()
  })

  it('should return false if "ids" property is undefined', async () => {
    const data: GameIgnoreList = { id: randomUUID(), title: 'Starfield' }
    await db.getClient().insertInto('game_ignore_list').values(data).execute()

    const { success, errors } = await validator.validate({} as any)

    expect(success).toBe(false)
    expect(errors?.length).toBeGreaterThan(0)
  })

  it('should return false if validation fails', async () => {
    const data: GameIgnoreList = { id: randomUUID(), title: 'Starfield' }
    const dto: RemoveIgnoredGamesDto = {
      ids: [data.id]
    }

    const { success, errors } = await validator.validate(dto)

    expect(success).toBe(false)
    expect(errors?.length).toBeGreaterThan(0)
  })
})
