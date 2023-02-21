export interface Scraper {
  /**
   * Gets the game price.
   *
   * ```
   * const price = await scraper.getGamePrice(url);
   * ```
   *
   * @param {string} gameUrl The game url.
   * @returns {Promise<number>} The game price.
   */
  getGamePrice(gameUrl: string): Promise<number>
}
