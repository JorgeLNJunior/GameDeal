import { CronJob } from 'cron'
import { inject, injectable } from 'tsyringe'

import { PINO_LOGGER } from '../dependencies/dependency.tokens'
import { ApplicationCronJob } from '../types/cron.type'
import { ApplicationLogger } from '../types/logger.type'

@injectable()
export class CronService {
  private jobs: CronJob[] = []

  /**
   * A service to handle cron jobs.
   *
   * @param {ApplicationLogger} logger An application logger.
   */
  constructor(@inject(PINO_LOGGER) private logger: ApplicationLogger) {}

  /**
   * Registers a list of cron jobs.
   *
   * ```
   * this.cronService.registerJobs(new MyFirtsJob(), new MySecondJob())
   * ```
   *
   * @param {ApplicationCronJob} jobs A list of cron jobs.
   */
  registerJobs(...jobs: ApplicationCronJob[]): void {
    for (const job of jobs) {
      this.jobs.push(new CronJob(job.cronTime, job.jobFunction))
    }
  }

  start(): void {
    this.logger.info('[CronService] Starting cron service')
    this.jobs.forEach((job) => job.start())
    this.logger.info('[CronService] Cron service started')
  }

  stop(): void {
    this.logger.info('[CronService] Stopping all jobs')
    this.jobs.forEach((job) => {
      job.stop()
    })
    this.logger.info('[CronService] All jobs stopped')
  }
}
