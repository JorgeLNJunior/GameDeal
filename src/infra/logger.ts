import pino from 'pino'

import { ApplicationLogger } from '../types/logger.type'

export class PinoLogger implements ApplicationLogger {
  private pino = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  })

  public info(obj: unknown, msg?: string) {
    this.pino.info(obj, msg)
  }

  public error(obj: unknown, msg?: string) {
    this.pino.error(obj, msg)
  }

  public fatal(obj: unknown, msg?: string) {
    this.pino.fatal(obj, msg)
  }

  public warn(obj: unknown, msg?: string) {
    this.pino.warn(obj, msg)
  }
}
