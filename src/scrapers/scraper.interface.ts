export interface Scraper {
  /**
   * Get the game price.
   *
   * ```
   * const price = await scraper.getPrice(data);
   * ```
   *
   * @param {string} gameUrl  The game url.
   * @returns {Promise<number>} The game price.
   */
  getGamePrice(gameUrl: string): Promise<number>
}
