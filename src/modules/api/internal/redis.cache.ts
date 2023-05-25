import ConfigService from '@config/config.service'
import { PinoLogger } from '@infra/pino.logger'
import { ApplicationCache, CacheData } from '@localtypes/http/cache.type'
import { DEFAULT_CACHE_TTL } from '@localtypes/http/cache.type'
import { Redis } from 'ioredis'
import { singleton } from 'tsyringe'

@singleton()
export class RedisCache implements ApplicationCache {
  private redis: Redis
  private config: ConfigService

  constructor() {
    this.config = new ConfigService(new PinoLogger())
    this.redis = new Redis({
      host: this.config.getEnv('REDIS_HOST'),
      port: this.config.getEnv('REDIS_PORT'),
      password: this.config.getEnv('REDIS_PASSWORD')
    })
  }

  /**
   * Gets a value stored in cache.
   *
   * ```
   * const cache = await cacheService.get(key)
   * ```
   * @param key - The cache key.
   * @returns The value and the expiration in seconds.
   */
  async get(key: string): Promise<CacheData | undefined> {
    const data = await this.redis.get(key)
    if (!data) return undefined

    const expires = await this.redis.ttl(key)
    const value = JSON.parse(data)
    return { value, expires }
  }

  /**
   * Stores a value in cache.
   *
   * ```
   * await cacheService.get(key, value, expire)
   * ```
   * @param key - The cache key.
   * @param value - The value to be stored.
   * @param expire - The expiration time in seconds. Default 60.
   */
  async set(key: string, value: unknown, expire?: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value))
    await this.redis.expire(key, expire || DEFAULT_CACHE_TTL)
  }
}
