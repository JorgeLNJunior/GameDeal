export interface ApplicationCronJob {
  /**
   * The cron syntax time to fire your job.
   * @see https://crontab.guru
   */
  cronTime: string
  /** The function that will be fired. */
  jobFunction: () => Promise<void>
}
