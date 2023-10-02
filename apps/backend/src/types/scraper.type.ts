export interface GamePriceScraper {
  /**
   * Gets the game price.
   * @example
   * ```
   * const price = await scraper.getGamePrice(url);
   * ```
   * @param gameUrl - The game url.
   * @returns The game price.
   */
  getGamePrice: (gameUrl: string) => Promise<number | null>
}

export interface GameDiscoveryScraper {
  /**
   * Discovery new games and saves them in the database.
   * @example
   * ```
   * const price = await scraper.discoveryGames();
   * ```
   */
  discoveryGames: () => Promise<void>
}
