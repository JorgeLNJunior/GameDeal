import { NOTIFIERS } from '@dependencies/dependency.tokens'
import type { Notifier, NotifyNewGamesData, NotifyPriceDropData } from '@localtypes/notifier.type'
import { inject, singleton } from 'tsyringe'

@singleton()
export class NotificationService {
  constructor(
    @inject(NOTIFIERS) private readonly notifiers: Notifier[],
  ) { }

  /**
   * Sends a notification when the price of a game drops.
   *
   * @param data - The data needed to notify.
   * @example
   * ```
   * await notificationService.notifyPriceDrop()
   * ```
   */
  async notifyPriceDrop(data: NotifyPriceDropData): Promise<void> {
    for await (const notifier of this.notifiers) {
      await notifier.notifyPriceDrop(data)
    }
  }

  /**
   * Sends a notification when new games are added.
   *
   * @param data - The data needed to notify.
   * @example
   * ```
   * await notificationService.notifyPriceDrop()
   * ```
   */
  async notifyNewGames(data: NotifyNewGamesData): Promise<void> {
    for await (const notifier of this.notifiers) {
      await notifier.notifyNewGames(data)
    }
  }
}
