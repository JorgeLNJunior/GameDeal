export interface Notifier {
  /**
   * Sends a notification.
   *
   * @example
   * ```
   * await notifier.notify()
   * ```
   */
  notify(data: NotifyData): Promise<void>
  /**
   * Starts the notifier.
   *
   *    @example
   * ```
   * await notifier.start()
   * ```
   */
  start(): Promise<void>
  /**
   * Stops the notifier.
   *
   * @example
   * ```
   * await notifier.stop()
   * ```
   */
  stop(): Promise<void>
}

export interface NotifyData {
  gameTitle: string
  gameUrl: string
  platform: 'Steam' | 'Nuuvem' | 'GamersGate'
  currentPrice: number
  oldPrice: number
}
