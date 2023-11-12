import { AuthService } from '@api/internal/auth.service'
import { PinoLogger } from '@infra/pino.logger'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
import { container } from 'tsyringe'

import { RemoveIgnoredGamesController } from './removeIgnoredGames.controller'
import { IsIgnoredGameExistsRepository } from './repositories/isIgnoredGameExists.repository'
import { RemoveIgnoredGamesRepository } from './repositories/removeIgnoredGames.repository'
import { RemoveIgnoredGamesValidator } from './validator/removeIgnoredGames.validator'

describe('RemoveIgnoredGamesController', () => {
  let controller: RemoveIgnoredGamesController
  let repository: RemoveIgnoredGamesRepository
  let validator: RemoveIgnoredGamesValidator
  let authService: AuthService

  beforeEach(() => {
    repository = container.resolve(RemoveIgnoredGamesRepository)
    const isIgnoredRepo = container.resolve(IsIgnoredGameExistsRepository)
    validator = new RemoveIgnoredGamesValidator(isIgnoredRepo)
    authService = container.resolve(AuthService)
    const logger = new PinoLogger()

    controller = new RemoveIgnoredGamesController(
      authService,
      repository,
      validator,
      logger
    )
  })

  it('should return a OK response if it succeeds', async () => {
    jest.spyOn(repository, 'remove').mockResolvedValueOnce()
    jest.spyOn(validator, 'validate').mockResolvedValueOnce({ success: true })

    const token = await authService.getJwtToken()
    const request = new HttpRequestBuilder()
      .withHeaders({ authorization: `Bearer ${token}` })
      .withBody({ ids: ['id'] })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
  })

  it('should return a BAD_REQUEST response if the validation fail', async () => {
    const errors = ['error']
    jest.spyOn(repository, 'remove').mockResolvedValueOnce()
    jest.spyOn(validator, 'validate').mockResolvedValueOnce({ success: false, errors })

    const token = await authService.getJwtToken()
    const request = new HttpRequestBuilder()
      .withHeaders({ authorization: `Bearer ${token}` })
      .withBody({})
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).messages).toEqual(errors)
  })

  it('should return UNAUTHORIZED if it did not receive an auth token', async () => {
    const request = new HttpRequestBuilder().build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(401)
  })

  it('should return UNAUTHORIZED if it received an invalid auth token', async () => {
    jest.spyOn(authService, 'verifyToken').mockResolvedValueOnce({
      isValid: false,
      error: 'invalid token'
    })

    const request = new HttpRequestBuilder().withHeaders({
      authorization: 'Bearer invalid.token'
    }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(401)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).message).toBe('invalid token')
  })

  it('should return a INTERNAL_ERROR response if something throw', async () => {
    jest.spyOn(authService, 'verifyToken').mockRejectedValueOnce(new Error())

    const token = await authService.getJwtToken()
    const request = new HttpRequestBuilder().withHeaders({
      authorization: `Bearer ${token}`
    }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
