export interface Scraper {
  /**
   * Gets the game price.
   * @example
   * ```
   * const price = await scraper.getGamePrice(url);
   * ```
   * @param gameUrl - The game url.
   * @returns The game price.
   */
  getGamePrice(gameUrl: string): Promise<number>
}
