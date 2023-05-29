import { container } from 'tsyringe'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    service = container.resolve(AuthService)
  })

  describe('getJwtToken', () => {
    it('should return a jwt token', async () => {
      const token = await service.getJwtToken()
      const isJWT = /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)

      expect(isJWT).toBe(true)
    })
  })

  describe('verifyToken', () => {
    it('should return true if a token is valid', async () => {
      const token = await service.getJwtToken()

      const { isValid } = await service.verifyToken(token)

      expect(isValid).toBe(true)
    })

    it('should return false and an error message if a token is not valid', async () => {
      const token = 'token'

      const { isValid, error } = await service.verifyToken(token)

      expect(isValid).toBe(false)
      expect(error).toBeDefined()
    })
  })
})
