import { DatabaseService } from '@database/database.service'
import { container } from 'tsyringe'

import { DatabaseMaintanceCronJob } from './databaseMaintance.cronjob'

describe('DatabaseMaintanceCronJob', () => {
  let job: DatabaseMaintanceCronJob
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    job = new DatabaseMaintanceCronJob(db)

    await db.connect()
  })

  afterEach(async () => {
    await db.disconnect()
  })

  it('should run all optimization queries', async () => {
    await expect(job.jobFunction()).resolves.not.toThrow()
  })
})
