import { Queue, Worker } from 'bullmq'
import { inject, singleton } from 'tsyringe'

import ConfigService from '../../config/config.service'
import { PINO_LOGGER } from '../../dependencies/dependency.tokens'
import { ApplicationLogger } from '../../types/logger.type'
import { GameJobProcessor } from './game.job.processor'

export interface ScrapeGamePriceData {
  gameId: string
  gameUrl: string
}

@singleton()
export class GameQueue {
  private queue!: Queue<ScrapeGamePriceData>
  private worker!: Worker<ScrapeGamePriceData>

  /**
   * Handles the game queue.
   *
   * @param gameJobProcessor - An instance of `GameJobProcessor`.
   * @param config - An instance of `ConfigService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(
    private gameJobProcessor: GameJobProcessor,
    private config: ConfigService,
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  /**
   * Adds a job to the queue.
   * You must call `init()` before call this method.
   *
   * @example
   * ```
   * await queue.init()
   * await queue.add(data)
   * ```
   * @param data - The data to add to the queue.
   */
  async add(data: ScrapeGamePriceData): Promise<void> {
    this.queue.add('scrape', data, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true
    })
  }

  /**
   * Starts the queue.
   * You must call this method before add a job to the queue.
   *
   * @example
   * ```
   * await queue.init()
   * ```
   */
  async init(): Promise<void> {
    this.queue = new Queue<ScrapeGamePriceData>('game', {
      connection: {
        host: this.config.getEnv('REDIS_HOST'),
        port: this.config.getEnv('REDIS_PORT'),
        password: this.config.getEnv('REDIS_PASSWORD')
      }
    })

    this.worker = new Worker<ScrapeGamePriceData, void>(
      'game',
      async (job) => {
        this.logger.info(job.data, `[GameQueue] processing job ${job.id}`)
        await this.gameJobProcessor.scrapePrice(job.data)
        this.logger.info(`[GameQueue] job ${job.id} processed`)
      },
      {
        connection: {
          host: this.config.getEnv('REDIS_HOST'),
          port: this.config.getEnv('REDIS_PORT'),
          password: this.config.getEnv('REDIS_PASSWORD')
        }
      }
    )

    this.queue.on('error', (err) => {
      this.logger.error(err, `[GameQueue] Queue failed`)
    })
    this.worker.on('failed', (job, err) => {
      this.logger.error(err, `[GameWorker] Job "${job?.id}" failed`)
    })
    this.worker.on('error', (err) => {
      this.logger.error(err, `[GameWorker] Worker failed`)
    })
  }

  /**
   * Gracefully stops the queue
   *
   * @example
   * ```
   * await queue.stop()
   * ```
   */
  async stop(): Promise<void> {
    this.logger.info('[GameQueue] stopping queue')
    await this.worker.close()
    await this.queue.close()
    this.logger.info('[GameQueue] queue stopped')
  }
}
