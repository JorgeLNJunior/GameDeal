export interface Notificator {
  /**
   * Sends a notification.
   */
  notify(): Promise<void>
  /**
   * Starts the notificator
   *
   *    @example
   * ```
   * await notificator.start()
   * ```
   */
  start(): Promise<void>
  /**
   * Stops the notificator
   *
   * @example
   * ```
   * await notificator.stop()
   * ```
   */
  stop(): Promise<void>
}
