import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { type GamePriceScraperData, QueueName } from '@localtypes/queue.type'
import { Worker } from 'bullmq'
import { inject, singleton } from 'tsyringe'

import { GameJobProcessor } from './game.job.processor'

@singleton()
export class GameWorker {
  private worker!: Worker<GamePriceScraperData>

  /**
   * Handles the game worker.
   * @param gameJobProcessor - An instance of `GameJobProcessor`.
   * @param config - An instance of `ConfigService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor (
    private readonly gameJobProcessor: GameJobProcessor,
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
    this.worker = new Worker<GamePriceScraperData, void>(
      QueueName.GAME_PRICE_SCRAPING,
      async (job) => {
        this.logger.info(job.data, `[GameWorker] processing job ${job.id ?? 'unknow'}`)
        await this.gameJobProcessor.scrapePrice(job.data)
        this.logger.info(`[GameWorker] job ${job.id ?? 'unknow'} processed`)
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
      this.logger.error(err, `[GameWorker] job "${job?.id ?? 'unknow'}" failed`)
    })
    this.worker.on('error', (err) => {
      this.logger.error(err, '[GameWorker] worker failed')
    })
  }

  /**
   * Gracefully stops the game worker
   * @example
   * ```
   * await worker.stop()
   * ```
   */
  async stop (): Promise<void> {
    this.logger.info('[GameWorker] stopping worker')
    await this.worker.close()
    this.logger.info('[GameWorker] worker stopped')
  }
}
