import { NOTIFICATORS, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { Notificator } from '@localtypes/notificator.type'
import { inject, singleton } from 'tsyringe'

@singleton()
export class NotificationService {
  constructor(
    @inject(NOTIFICATORS) private notificators: Notificator[],
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  /**
   * Sends a game price notification.
   *
   * WARNING: You must call the `start()` method before calling this.
   *
   * @example
   * ```
   * await notificationService.notify()
   * ```
   */
  async notify(): Promise<void> {
    for await (const notificator of this.notificators) {
      await notificator.notify()
    }
  }

  /**
   * Starts the notification service and all its notificators.
   *
   * WARNING: This method is must be called before sending any notification.
   *
   * @example
   * ```
   * await notificationService.start()
   * ```
   */
  async start(): Promise<void> {
    this.logger.info('Starting all notification services')
    for await (const notificator of this.notificators) {
      await notificator.start()
      this.logger.info(`Notificator ${notificator.constructor.name} started`)
    }
    this.logger.info('Notification services started')
  }

  /**
   * Stops the notification service and all its notificators.
   *
   * @example
   * ```
   * await notificationService.stop()
   * ```
   */
  async stop(): Promise<void> {
    this.logger.info('Stopping all notification services')
    for await (const notificator of this.notificators) {
      await notificator.stop()
    }
    this.logger.info('Notification services stopped')
  }
}
