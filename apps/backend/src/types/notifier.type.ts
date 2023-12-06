export interface Notifier {
  /**
   * Sends a notification.
   * @example
   * ```
   * await notifier.notifyPriceDrop()
   * ```
   */
  notifyPriceDrop: (data: NotifyPriceDropData) => Promise<void>
  /**
   * Starts the notifier.
   *    @example
   * ```
   * await notifier.start()
   * ```
   */
  start: () => Promise<void>
  /**
   * Stops the notifier.
   * @example
   * ```
   * await notifier.stop()
   * ```
   */
  stop: () => Promise<void>
}

export interface NotifyPriceDropData {
  gameTitle: string
  gameUrl: string
  platform: 'Steam' | 'Nuuvem' | 'Green Man Gaming'
  currentPrice: number
  oldPrice: number | null
}
