export interface ApplicationCache {
  get: (key: string) => Promise<CacheData | undefined>
  set: (key: string, value: unknown, expire?: number) => Promise<void>
}

export interface CacheData {
  value: unknown
  expires: number
}

export const DEFAULT_CACHE_TTL = 60
