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

export enum Store {
  STEAM = 'Steam',
  NUUVEM = 'Nuuvem',
  GREEN_MAN_GAMMING = 'Green Man Gaming'
}

export interface NotifyPriceDropData {
  /** The games's title. */
  gameTitle: string
  /** The game's URL. */
  gameUrl: string
  /** The store with the lowest price. */
  store: Store
  /** The lowest price collected by scrappers. */
  currentPrice: number
  /** The latest registered price. */
  oldPrice: number | null
}
