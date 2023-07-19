import { container } from 'tsyringe'

import ConfigService from './config.service'

describe('ConfigService', () => {
  let configService: ConfigService

  beforeEach(() => {
    configService = container.resolve(ConfigService)
  })

  it('should return a env var value', async () => {
    const HOST = 'loacalhost'
    process.env.HOST = HOST
    expect(configService.getEnv('HOST')).toBe(HOST)
  })

  it('should return undefined if the env var is not set', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(configService.getEnv('FOO' as any)).toBe(undefined)
  })
})
