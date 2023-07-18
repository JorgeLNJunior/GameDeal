import type { ApplicationCache, CacheData } from '@localtypes/http/cache.type'
import { DEFAULT_CACHE_TTL } from '@localtypes/http/cache.type'
import NodeCache from 'node-cache'
import { singleton } from 'tsyringe'

@singleton()
export class MemoryCache implements ApplicationCache {
  private readonly cache = new NodeCache({ stdTTL: DEFAULT_CACHE_TTL })

  async get (key: string): Promise<CacheData | undefined> {
    const value = await this.cache.get(key)
    if (value == null) return undefined

    const exp = this.cache.getTtl(key)
    const NOW = Date.now()

    const expires = (exp as number - NOW) / 1000
    return { value, expires }
  }

  async set (key: string, value: unknown, expire?: number): Promise<void> {
    this.cache.set(key, value, expire ?? DEFAULT_CACHE_TTL)
  }
}
