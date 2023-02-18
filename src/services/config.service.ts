import { config } from 'dotenv'
import { inject, injectable } from 'tsyringe'

import { PINO_LOGGER } from '../dependencies/dependency.tokens'
import { ApplicationLogger } from '../types/logger.type'

config()

@injectable()
export default class ConfigService {
  constructor(@inject(PINO_LOGGER) private logger: ApplicationLogger) {}

  getEnv<T>(env: string): T | undefined {
    if (process.env[env]) {
      return process.env[env] as unknown as T
    }

    this.logger.warn(`the enviroment variable "${env}" is undefined`)

    return undefined
  }
}
