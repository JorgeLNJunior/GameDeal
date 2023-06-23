import { type ApplicationLogger } from '@localtypes/logger.type'
import pino from 'pino'

export class PinoLogger implements ApplicationLogger {
  private readonly pino = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  })

  public info (obj: unknown, msg?: string): void {
    this.pino.info(obj, msg)
  }

  public error (obj: unknown, msg?: string, ...args: unknown[]): void {
    this.pino.error(obj, msg, args)
  }

  public fatal (obj: unknown, msg?: string): void {
    this.pino.fatal(obj, msg)
  }

  public warn (obj: unknown, msg?: string): void {
    this.pino.warn(obj, msg)
  }
}
