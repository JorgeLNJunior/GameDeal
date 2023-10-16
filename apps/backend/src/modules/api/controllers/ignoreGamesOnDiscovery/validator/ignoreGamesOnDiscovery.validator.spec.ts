/* eslint-disable @typescript-eslint/no-explicit-any */
import { type IgnoreGamesOnDiscoveryDto } from '../dto/ignoreGamesOnDiscovery.dto'
import { IgnoreGamesOnDiscoveryValidator } from './ignoreGamesOnDiscovery.validator'

describe('IgnoreGamesOnDiscoveryValidator', () => {
  it('should return true if validation succeeds', async () => {
    const data: IgnoreGamesOnDiscoveryDto = {
      titles: [
        'God of War'
      ]
    }

    const { success, errors } = new IgnoreGamesOnDiscoveryValidator().validate(data)

    expect(success).toBe(true)
    expect(errors).toBeUndefined()
  })

  it('should return false if "title" is not an array', async () => {
    const data: IgnoreGamesOnDiscoveryDto = {
      titles: { title: 'God of War' } as any
    }

    const { success, errors } = new IgnoreGamesOnDiscoveryValidator().validate(data)

    expect(success).toBe(false)
    expect(errors?.length).toBe(1)
  })

  it('should return false if a title is not a string', async () => {
    const data: IgnoreGamesOnDiscoveryDto = {
      titles: { title: 'God of War' } as any
    }

    const { success, errors } = new IgnoreGamesOnDiscoveryValidator().validate(data)

    expect(success).toBe(false)
    expect(errors?.length).toBeGreaterThan(0)
  })
})
