import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { type GameDiscoveryScraperData, type QueueJobName, QueueName } from '@localtypes/queue.type'
import { Worker } from 'bullmq'
import { inject, singleton } from 'tsyringe'

import { GameDiscoveryJobProcessor } from './gameDiscovery.job.processor'

@singleton()
export class GameDiscoveryWorker {
  private worker!: Worker<GameDiscoveryScraperData>

  /**
   * Handles the game discovery worker.
   *
   * @param processor - An instance of `GameDiscoveryJobProcessor`.
   * @param config - An instance of `ConfigService`.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor (
    private readonly processor: GameDiscoveryJobProcessor,
    private readonly config: ConfigService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  /**
   * Starts the game discovery worker.
   * @example
   * ```
   * await worker.init()
   * ```
   */
  async init (): Promise<void> {
    this.worker = new Worker<GameDiscoveryScraperData, void>(
      QueueName.GAME_DISCOVERY,
      async (job) => {
        this.logger.info(job.data, `[GameDiscoveryWorker] processing job ${job.id ?? 'unknow'}`)
        await this.processor.findUrls(job.name as QueueJobName, job.data)
        this.logger.info(`[GameDiscoveryWorker] job ${job.id ?? 'unknow'} processed`)
      },
      {
        connection: {
          host: this.config.getEnv('REDIS_HOST'),
          port: this.config.getEnv('REDIS_PORT'),
          password: this.config.getEnv('REDIS_PASSWORD')
        },
        concurrency: 5
      }
    )

    this.worker.on('failed', (job, err) => {
      this.logger.error(err, `[GameDiscoveryWorker] job "${job?.id ?? 'unknow'}" failed`)
    })
    this.worker.on('error', (err) => {
      this.logger.error(err, '[GameDiscoveryWorker] worker failed')
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
    this.logger.info('[GameDiscoveryWorker] stopping worker')
    await this.worker.close()
    this.logger.info('[GameDiscoveryWorker] worker stopped')
  }
}
