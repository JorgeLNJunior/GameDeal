import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import dotenv from 'dotenv'
import { inject, injectable } from 'tsyringe'

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

@injectable()
export default class ConfigService {
  /**
   * Configuration class helper.
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor (@inject(PINO_LOGGER) private readonly logger: ApplicationLogger) {}

  /**
   * Gets a value of a environment variable.
   * @example
   * ```
   * const port = await configService.get<number>('PORT')
   * ```
   * @param key - The environment variable key.
   * @returns The environment variable value.
   */
  public getEnv<T>(key: EnvironmentVariable): T | undefined {
    if (process.env[key] != null) {
      return process.env[key] as unknown as T
    }

    this.logger.warn(
      `[ConfigService] the environment variable "${key}" is undefined`
    )

    return undefined
  }
}

type EnvironmentVariable =
  'ADMIN_USER' |
  'ADMIN_PASSWORD' |
  'DB_HOST' |
  'DB_NAME' |
  'DB_PORT' |
  'DB_USER' |
  'DB_PASSWORD' |
  'HOST' |
  'JWT_SECRET' |
  'PORT' |
  'REDIS_HOST' |
  'REDIS_PORT' |
  'REDIS_PASSWORD' |
  'TELEGRAM_BOT_TOKEN' |
  'TELEGRAM_CHAT_ID'
