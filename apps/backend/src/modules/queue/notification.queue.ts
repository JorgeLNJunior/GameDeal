import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { type NotifyData } from '@localtypes/notifier.type'
import { QueueJobName, QueueName } from '@localtypes/queue.type'
import { Queue } from 'bullmq'
import { inject, singleton } from 'tsyringe'

@singleton()
export class NotificationQueue {
  private queue!: Queue<NotifyData>

  /**
   * Handles the notification queue.
   * @param config - An instance of `ConfigService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor (
    private readonly config: ConfigService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  /**
   * Adds a job to the queue.
   * You must call `init()` before call this method.
   * @example
   * ```
   * await queue.init()
   * await queue.add(data)
   * ```
   * @param data - The data to add to the queue.
   */
  async add (data: NotifyData): Promise<void> {
    await this.queue.add(QueueJobName.NOTIFY_PRICE_DROP, data)
  }

  /**
   * Starts the queue.
   * You must call this method before add a job to the queue.
   * @example
   * ```
   * await queue.init()
   * ```
   */
  async init (): Promise<void> {
    this.queue = new Queue<NotifyData>(QueueName.NOTICATION, {
      connection: {
        host: this.config.getEnv('REDIS_HOST'),
        port: this.config.getEnv('REDIS_PORT'),
        password: this.config.getEnv('REDIS_PASSWORD'),
        enableOfflineQueue: false
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 60000 * 5
        },
        removeOnComplete: {
          count: 100,
          age: 3600 * 24 * 7
        },
        removeOnFail: {
          count: 500,
          age: 3600 * 24 * 7
        }
      }
    })

    this.queue.on('error', (err) => {
      this.logger.error(err, '[NotificationQueue] queue failed')
    })
  }

  /**
   * Gracefully stops the queue
   * @example
   * ```
   * await queue.stop()
   * ```
   */
  async stop (): Promise<void> {
    this.logger.info('[NotificationQueue] stopping the queue')
    await this.queue.close()
    this.logger.info('[NotificationQueue] the queue stopped')
  }
}
