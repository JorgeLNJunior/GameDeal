import dotenv from 'dotenv'
import { inject, injectable } from 'tsyringe'

import { PINO_LOGGER } from '../dependencies/dependency.tokens'
import { ApplicationLogger } from '../types/logger.type'

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

@injectable()
export default class ConfigService {
  /**
   * Configuration class helper.
   *
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(@inject(PINO_LOGGER) private logger: ApplicationLogger) {}

  /**
   * Gets a value of a environment variable.
   *
   * @example
   * ```
   * const port = await configService.get<number>('PORT')
   * ```
   * @param key - The environment variable key.
   * @returns The environment variable value.
   */
  public getEnv<T>(key: string): T | undefined {
    if (process.env[key]) {
      return process.env[key] as unknown as T
    }

    this.logger.warn(`the enviroment variable "${key}" is undefined`)

    return undefined
  }
}
