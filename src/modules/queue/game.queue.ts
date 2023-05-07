import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import {
  QueueJobName,
  QueueName,
  ScrapeGamePriceData
} from '@localtypes/queue.type'
import { Queue } from 'bullmq'
import { inject, singleton } from 'tsyringe'

@singleton()
export class GameQueue {
  private queue!: Queue<ScrapeGamePriceData>

  /**
   * Handles the game queue.
   * @param config - An instance of `ConfigService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(
    private config: ConfigService,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
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
  async add(data: ScrapeGamePriceData): Promise<void> {
    this.queue.add(QueueJobName.SCRAPE_GAME_PRICE, data, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true
    })
  }

  /**
   * Starts the queue.
   * You must call this method before add a job to the queue.
   * @example
   * ```
   * await queue.init()
   * ```
   */
  async init(): Promise<void> {
    this.queue = new Queue<ScrapeGamePriceData>(QueueName.GAME_SCRAPING, {
      connection: {
        host: this.config.getEnv('REDIS_HOST'),
        port: this.config.getEnv('REDIS_PORT'),
        password: this.config.getEnv('REDIS_PASSWORD'),
        enableOfflineQueue: false
      }
    })

    this.queue.on('error', (err) => {
      this.logger.error(err, `[GameQueue] queue failed`)
    })
  }

  /**
   * Gracefully stops the queue
   * @example
   * ```
   * await queue.stop()
   * ```
   */
  async stop(): Promise<void> {
    this.logger.info('[GameQueue] stopping the queue')
    await this.queue.close()
    this.logger.info('[GameQueue] the queue stopped')
  }
}
