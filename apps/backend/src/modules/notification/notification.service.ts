import { NOTIFIERS, PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import type { Notifier, NotifyNewGamesData, NotifyPriceDropData } from '@localtypes/notifier.type'
import { inject, singleton } from 'tsyringe'

@singleton()
export class NotificationService {
  constructor (
    @inject(NOTIFIERS) private readonly notifiers: Notifier[],
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  /**
   * Sends a notification when the price of a game drops.
   *
   * WARNING: You must call the `start()` method before calling this.
   * @param data - The data needed to notify.
   * @example
   * ```
   * await notificationService.notifyPriceDrop()
   * ```
   */
  async notifyPriceDrop (data: NotifyPriceDropData): Promise<void> {
    for await (const notifier of this.notifiers) {
      await notifier.notifyPriceDrop(data)
    }
  }

  /**
   * Sends a notification when new games are added.
   *
   * WARNING: You must call the `start()` method before calling this.
   * @param data - The data needed to notify.
   * @example
   * ```
   * await notificationService.notifyPriceDrop()
   * ```
   */
  async notifyNewGames (data: NotifyNewGamesData): Promise<void> {
    for await (const notifier of this.notifiers) {
      await notifier.notifyNewGames(data)
    }
  }

  /**
   * Starts the notification service and all its notifiers.
   *
   * WARNING: This method is must be called before sending any notification.
   * @example
   * ```
   * await notificationService.start()
   * ```
   */
  async start (): Promise<void> {
    this.logger.info('[NotificationService] starting all notification services')
    for await (const notifier of this.notifiers) {
      await notifier.start()
      this.logger.info(
        `[NotificationService] notifier "${notifier.constructor.name}" started`
      )
    }
    this.logger.info('[NotificationService] notification service started')
  }

  /**
   * Stops the notification service and all its notifiers.
   * @example
   * ```
   * await notificationService.stop()
   * ```
   */
  async stop (): Promise<void> {
    this.logger.info('[NotificationService] stopping notification service')
    for await (const notifier of this.notifiers) {
      await notifier.stop()
    }
    this.logger.info('[NotificationService] notification service stopped')
  }
}
