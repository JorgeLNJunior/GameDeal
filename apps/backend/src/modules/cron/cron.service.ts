import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { type ApplicationCronJob } from '@localtypes/cron.type'
import { ApplicationLogger } from '@localtypes/logger.type'
import { CronJob } from 'cron'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CronService {
  private readonly jobs: CronJob[] = []

  /**
   * A service to handle cron jobs.
   * @param logger - An application logger.
   */
  constructor (@inject(PINO_LOGGER) private readonly logger: ApplicationLogger) {}

  /**
   * Registers a list of cron jobs.
   * @example
   * ```
   * this.cronService.registerJobs(new MyFirtsJob(), new MySecondJob())
   * ```
   * @param jobs - A list of cron jobs.
   */
  registerJobs (...jobs: ApplicationCronJob[]): void {
    for (const job of jobs) {
      this.jobs.push(
        new CronJob(
          job.cronTime,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async function () {
            await job.jobFunction()
          },
          null,
          false,
          'America/Sao_Paulo'
        )
      )
    }
  }

  /**
   * Starts the cron service.
   */
  start (): void {
    this.logger.info('[CronService] starting cron service')
    this.jobs.forEach((job) => { job.start() })
    this.logger.info('[CronService] cron service started')
  }

  /**
   * Stops the cron service.
   */
  stop (): void {
    this.logger.info('[CronService] stopping all jobs')
    this.jobs.forEach((job) => {
      job.stop()
    })
    this.logger.info('[CronService] all jobs are stopped')
  }
}
