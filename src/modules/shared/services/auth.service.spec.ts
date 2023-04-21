import { container } from 'tsyringe'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    service = container.resolve(AuthService)
  })

  it('should return a jwt token', async () => {
    const token = await service.getJwtToken()
    const isJWT = new RegExp(/^[\w-]+\.[\w-]+\.[\w-]+$/).test(token)

    expect(isJWT).toBe(true)
  })
})
