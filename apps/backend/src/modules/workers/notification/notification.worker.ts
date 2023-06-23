import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import type { NotifyData } from '@localtypes/notifier.type'
import { QueueName } from '@localtypes/queue.type'
import { NotificationService } from '@notification/notification.service'
import { Worker } from 'bullmq'
import { inject, singleton } from 'tsyringe'

@singleton()
export class NotificationWorker {
  private worker!: Worker<NotifyData>

  /**
   * Handles the notification worker.
   * @param notificationService - An instance of `NotificationService`.
   * @param config - An instance of `ConfigService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor (
    private readonly notificationService: NotificationService,
    private readonly config: ConfigService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  /**
   * Starts the game worker.
   * @example
   * ```
   * await worker.init()
   * ```
   */
  async init (): Promise<void> {
    await this.notificationService.start()

    this.worker = new Worker<NotifyData, void>(
      QueueName.NOTICATION,
      async (job) => {
        this.logger.info(`[NotificationWorker] processing job ${job.id ?? 'unknow'}`)
        await this.notificationService.notify(job.data)
        this.logger.info(`[NotificationWorker] job ${job.id ?? 'unknow'} processed`)
      },
      {
        connection: {
          host: this.config.getEnv('REDIS_HOST'),
          port: this.config.getEnv('REDIS_PORT'),
          password: this.config.getEnv('REDIS_PASSWORD')
        }
      }
    )

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        err,
        `[NotificationWorker] job "${job?.id ?? 'unknow'}" failed`,
        { data: job?.data, reason: job?.failedReason }
      )
    })
    this.worker.on('error', (err) => {
      this.logger.error(err, '[NotificationWorker] worker failed')
    })
  }

  /**
   * Gracefully stops the notification worker
   * @example
   * ```
   * await worker.stop()
   * ```
   */
  async stop (): Promise<void> {
    this.logger.info('[NotificationWorker] stopping worker')
    await this.worker.close()
    this.logger.info('[NotificationWorker] worker stopped')
    await this.notificationService.stop()
  }
}
