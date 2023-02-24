import { container } from 'tsyringe'

import ConfigService from './config.service'

describe('ConfigService', () => {
  let configService: ConfigService

  beforeEach(() => {
    configService = container.resolve(ConfigService)
  })

  it('should return a env var value', async () => {
    process.env.FOO = 'bar'
    expect(configService.getEnv<string>('FOO')).toBe('bar')
  })

  it('should return undefined if the env var is not set', async () => {
    expect(configService.getEnv<string>('BAR')).toBe(undefined)
  })
})
