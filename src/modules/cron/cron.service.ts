import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationCronJob } from '@localtypes/cron.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { CronJob } from 'cron'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CronService {
  private jobs: CronJob[] = []

  /**
   * A service to handle cron jobs.
   *
   * @param logger - An application logger.
   */
  constructor(@inject(PINO_LOGGER) private logger: ApplicationLogger) {}

  /**
   * Registers a list of cron jobs.
   *
   * @example
   * ```
   * this.cronService.registerJobs(new MyFirtsJob(), new MySecondJob())
   * ```
   * @param jobs - A list of cron jobs.
   */
  registerJobs(...jobs: ApplicationCronJob[]): void {
    for (const job of jobs) {
      this.jobs.push(
        new CronJob(job.cronTime, async function () {
          await job.jobFunction()
        })
      )
    }
  }

  /**
   * Starts the cron service.
   */
  start(): void {
    this.logger.info('[CronService] starting cron service')
    this.jobs.forEach((job) => job.start())
    this.logger.info('[CronService] cron service is started')
  }

  /**
   * Stops the cron service.
   */
  stop(): void {
    this.logger.info('[CronService] stopping all jobs')
    this.jobs.forEach((job) => {
      job.stop()
    })
    this.logger.info('[CronService] all jobs are stopped')
  }
}
