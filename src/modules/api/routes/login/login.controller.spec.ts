import ConfigService from '@config/config.service'
import { PinoLogger } from '@infra/pino.logger'
import { container } from 'tsyringe'

import { LoginController } from './login.controller'
import { LoginService } from './login.service'

describe('LoginController', () => {
  let controller: LoginController
  let loginService: LoginService

  beforeEach(async () => {
    loginService = container.resolve(LoginService)
    controller = new LoginController(
      container.resolve(ConfigService),
      loginService,
      new PinoLogger()
    )
  })

  it('should return OK and a jwt token', async () => {
    const data = {
      user: 'admin',
      password: 'admin'
    }
    const jwt = 'jwt-token'

    jest.spyOn(loginService, 'getJwtToken').mockResolvedValueOnce(jwt)

    const response = await controller.handle({
      headers: {},
      params: {},
      query: {},
      body: data
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
      body: data
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
      body: data
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
      .spyOn(loginService, 'getJwtToken')
      .mockRejectedValueOnce(new Error('jwt error'))

    const response = await controller.handle({
      headers: {},
      params: {},
      query: {},
      body: data
    })

    expect(response.statusCode).toBe(500)
  })
})
