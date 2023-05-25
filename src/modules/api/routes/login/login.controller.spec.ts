import ConfigService from '@config/config.service'
import { PinoLogger } from '@infra/pino.logger'
import { AuthService } from '@shared/services/auth.service'
import { container } from 'tsyringe'

import { LoginController } from './login.controller'

describe('LoginController', () => {
  let controller: LoginController
  let authService: AuthService

  beforeEach(async () => {
    authService = container.resolve(AuthService)
    controller = new LoginController(
      container.resolve(ConfigService),
      authService,
      new PinoLogger()
    )
  })

  it('should return OK and a jwt token', async () => {
    const data = {
      user: 'admin',
      password: 'admin'
    }
    const jwt = 'jwt-token'

    jest.spyOn(authService, 'getJwtToken').mockResolvedValueOnce(jwt)

    const response = await controller.handle({
      headers: {},
      params: {},
      query: {},
      body: data,
      url: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).token).toBe(jwt)
    expect(response.statusCode).toBe(200)
  })

  it('should return UNAUTHORIZED if it receives an invalid user', async () => {
    // credentials are defined in .env.test file
    const data = {
      user: 'invalid',
      password: 'admin'
    }

    const response = await controller.handle({
      headers: {},
      params: {},
      query: {},
      body: data,
      url: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).message).toBe('invalid credentials')
    expect(response.statusCode).toBe(401)
  })

  it('should return UNAUTHORIZED if it receives an invalid password', async () => {
    // credentials are defined in .env.test file
    const data = {
      user: 'admin',
      password: 'invalid'
    }

    const response = await controller.handle({
      headers: {},
      params: {},
      query: {},
      body: data,
      url: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).message).toBe('invalid credentials')
    expect(response.statusCode).toBe(401)
  })

  it('should return SERVER ERROR if it throws', async () => {
    const data = {
      user: 'admin',
      password: 'admin'
    }

    jest
      .spyOn(authService, 'getJwtToken')
      .mockRejectedValueOnce(new Error('jwt error'))

    const response = await controller.handle({
      headers: {},
      params: {},
      query: {},
      body: data,
      url: ''
    })

    expect(response.statusCode).toBe(500)
  })
})
