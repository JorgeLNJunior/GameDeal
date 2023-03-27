import { NOTIFIERS, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { Notifier, NotifyData } from '@localtypes/notifier.type'
import { inject, singleton } from 'tsyringe'

@singleton()
export class NotificationService {
  constructor(
    @inject(NOTIFIERS) private notifiers: Notifier[],
    @inject(PINO_LOGGER) private logger: ApplicationLogger
  ) {}

  /**
   * Sends a game price notification.
   *
   * WARNING: You must call the `start()` method before calling this.
   *
   * @param data - The data needed to notify.
   * @example
   * ```
   * await notificationService.notify()
   * ```
   */
  async notify(data: NotifyData): Promise<void> {
    for await (const notifier of this.notifiers) {
      await notifier.notify(data)
    }
  }

  /**
   * Starts the notification service and all its notifiers.
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
    for await (const notifier of this.notifiers) {
      await notifier.start()
      this.logger.info(`Notifier ${notifier.constructor.name} started`)
    }
    this.logger.info('Notification services started')
  }

  /**
   * Stops the notification service and all its notifiers.
   *
   * @example
   * ```
   * await notificationService.stop()
   * ```
   */
  async stop(): Promise<void> {
    this.logger.info('Stopping all notification services')
    for await (const notifier of this.notifiers) {
      await notifier.stop()
    }
    this.logger.info('Notification services stopped')
  }
}
