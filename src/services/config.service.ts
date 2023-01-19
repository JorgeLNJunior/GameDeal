import { config } from 'dotenv'
import { injectable } from 'tsyringe'

import { Logger } from '../infra/logger'
config()

@injectable()
export default class ConfigService {
  constructor(private logger: Logger) {}

  getEnv<T>(env: string): T | undefined {
    if (process.env[env]) {
      return process.env[env] as unknown as T
    }

    this.logger.warn(`the enviroment variable "${env}" is undefined`)

    return undefined
  }
}
