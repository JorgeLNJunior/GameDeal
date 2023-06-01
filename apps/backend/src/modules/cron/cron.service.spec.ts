import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCronJob } from '@localtypes/cron.type'

import { CronService } from './cron.service'

class FakeJob implements ApplicationCronJob {
  public cronTime = '00 00 * * *'
  async jobFunction (): Promise<void> {}
}

describe('CronService', () => {
  let service: CronService

  beforeEach(async () => {
    service = new CronService(new PinoLogger())
  })

  it('should register a job', async () => {
    expect(() => {
      service.registerJobs(new FakeJob())
    }).not.toThrow()
  })

  it('should start all jobs', async () => {
    service.registerJobs(new FakeJob())

    expect(() => {
      service.start()
    }).not.toThrow()

    service.stop()
  })

  it('should stop all jobs', async () => {
    service.registerJobs(new FakeJob())

    expect(() => {
      service.stop()
    }).not.toThrow()
  })
})
