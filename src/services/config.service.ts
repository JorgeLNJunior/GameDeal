import { config } from 'dotenv'

import logger from '../logger'
config()

export default class ConfigService {
  getEnv<T>(env: string): T | undefined {
    if (process.env[env]) {
      return process.env[env] as unknown as T
    }

    logger.warn(
      `the enviroment variable "${env}" is undefined`,
      ConfigService.name
    )

    return undefined
  }
}
