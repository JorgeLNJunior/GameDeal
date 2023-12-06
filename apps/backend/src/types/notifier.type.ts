export interface Notifier {
  /**
   * Sends a notification when the price of a game drops.
   * @example
   * ```
   * await notifier.notifyPriceDrop()
   * ```
   */
  notifyPriceDrop: (data: NotifyPriceDropData) => Promise<void>

  /**
   * Sends a notification when new games are added.
   * @example
   * ```
   * await notifier.notifyNewGames()
   * ```
   */
  notifyNewGames: (data: NotifyNewGamesData) => Promise<void>

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

export interface NotifyNewGamesData {
  /** Count of added games. */
  count: number
}

export type NotificationData = NotifyPriceDropData | NotifyNewGamesData
