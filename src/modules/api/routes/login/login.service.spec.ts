import { container } from 'tsyringe'

import { LoginService } from './login.service'

describe('LoginService', () => {
  let service: LoginService

  beforeEach(async () => {
    service = container.resolve(LoginService)
  })

  it('should return a jwt token', async () => {
    const token = await service.getJwtToken()
    const isJWT = new RegExp(/^[\w-]+\.[\w-]+\.[\w-]+$/).test(token)

    expect(isJWT).toBe(true)
  })
})
