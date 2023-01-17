import pino from 'pino'

export class Logger {
  private pino = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  })

  public info(obj: unknown, msg?: string, ...args: unknown[]) {
    this.pino.info(obj, msg, args)
  }

  public error(obj: unknown, msg?: string, ...args: unknown[]) {
    this.pino.error(obj, msg, args)
  }

  public fatal(obj: unknown, msg?: string, ...args: unknown[]) {
    this.pino.fatal(obj, msg, args)
  }

  public warn(obj: unknown, msg?: string, ...args: unknown[]) {
    this.pino.warn(obj, msg, args)
  }
}
