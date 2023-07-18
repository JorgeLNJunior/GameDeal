export interface ApplicationCache {
  /**
   * Gets a value stored in cache.
   *
   * ```
   * const cache = await cache.get(key)
   * ```
   * @param key - The cache key.
   * @returns The value and the expiration in seconds.
   */
  get: (key: string) => Promise<CacheData | undefined>

  /**
   * Stores a value in cache.
   *
   * ```
   * await cache.get(key, value, expire)
   * ```
   * @param key - The cache key.
   * @param value - The value to be stored.
   * @param expire - The expiration time in seconds. Default 60.
   */
  set: (key: string, value: unknown, expire?: number) => Promise<void>
}

export interface CacheData {
  value: unknown
  expires: number
}

export const DEFAULT_CACHE_TTL = 60
