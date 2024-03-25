import { DatabaseService } from '@database/database.service'
import { AxiosService } from '@infra/axios.service'
import { PinoLogger } from '@infra/pino.logger'
import { GameBuilder } from '@packages/testing'
import { AxiosError } from 'axios'
import { container } from 'tsyringe'

import { RemoveInvalidLinksCronJob } from './removeInvalidLinks.conjob'
import { FindGMGURLsRepository } from './repositories/findGMGUrls.repository'
import { FindNuuvemURLsRepository } from './repositories/findNuuvemUrls.repository'
import { RemoveStoreURLRepository } from './repositories/removeStoreUrl.repository'

describe('RemoveInvalidLinksCronJob', () => {
  let job: RemoveInvalidLinksCronJob
  let nuuvemRepo: FindNuuvemURLsRepository
  let gmgRepo: FindGMGURLsRepository
  let removeUrlRepo: RemoveStoreURLRepository
  let db: DatabaseService
  let axios: AxiosService

  beforeEach(async () => {
    const logger = new PinoLogger()

    db = container.resolve(DatabaseService)
    nuuvemRepo = new FindNuuvemURLsRepository(db)
    gmgRepo = new FindGMGURLsRepository(db)
    removeUrlRepo = new RemoveStoreURLRepository(db)
    axios = new AxiosService(logger)

    job = new RemoveInvalidLinksCronJob(nuuvemRepo, gmgRepo, removeUrlRepo, axios)

    await db.connect()
  })

  afterEach(async () => {
    await db.getClient().deleteFrom('game').execute()
    await db.disconnect()
  })

  it('should remove all invalid URLs', async () => {
    const game = new GameBuilder().build()

    const client = db.getClient()
    await client.insertInto('game').values(game).execute()

    // axios.get = jest.fn().mockRejectedValue(NOT_FOUND_ERROR)
    jest.spyOn(axios, 'get').mockRejectedValue(NOT_FOUND_ERROR)

    await job.jobFunction()

    const result = await client
      .selectFrom('game')
      .select(['nuuvem_url', 'green_man_gaming_url'])
      .where('id', '=', game.id)
      .executeTakeFirst()

    expect(result?.nuuvem_url).toBe(null)
    expect(result?.green_man_gaming_url).toBe(null)
  })
})

const NOT_FOUND_ERROR = new AxiosError(undefined, undefined, undefined, undefined, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: {} as any,
  data: {},
  headers: {},
  status: 404,
  statusText: 'ERROR'
})
