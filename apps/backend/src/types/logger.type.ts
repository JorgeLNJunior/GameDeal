export interface ApplicationLogger {
  info: (obj: unknown, msg?: string) => void

  error: (obj: unknown, msg?: string, ...args: unknown[]) => void

  fatal: (obj: unknown, msg?: string) => void

  warn: (obj: unknown, msg?: string) => void
}
