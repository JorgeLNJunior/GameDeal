import { AuthService } from '@api/internal/auth.service'
import { PinoLogger } from '@infra/pino.logger'
import type { GameIgnoreList } from '@packages/types'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
import { container } from 'tsyringe'

import { AddIgnoredGamesController } from './addIgnoredGames.controller'
import { AddIgnoredGamesRepository } from './repositories/addIgnoredGames.repository'
import { AddIgnoredGamesValidator } from './validator/addIgnoredGames.validator'

describe('AddIgnoredGamesController', () => {
  let controller: AddIgnoredGamesController
  let validator: AddIgnoredGamesValidator
  let repository: AddIgnoredGamesRepository
  let authService: AuthService

  beforeEach(() => {
    validator = container.resolve(AddIgnoredGamesValidator)
    repository = container.resolve(AddIgnoredGamesRepository)
    authService = container.resolve(AuthService)
    const logger = new PinoLogger()

    controller = new AddIgnoredGamesController(
      authService,
      repository,
      validator,
      logger
    )
  })

  it('should return a CREATED response if it succeeds', async () => {
    const data: GameIgnoreList[] = [
      { id: 'id', title: 'title' }
    ]

    jest.spyOn(repository, 'add').mockResolvedValueOnce(data)

    const token = await authService.getJwtToken()
    const request = new HttpRequestBuilder()
      .withHeaders({ authorization: `Bearer ${token}` })
      .withBody({ titles: ['title'] })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(201)
    expect(response.body).toBeDefined()
  })

  it('should return a BAD_REQUEST response if validation fails', async () => {
    const token = await authService.getJwtToken()

    const request = new HttpRequestBuilder()
      .withHeaders({ authorization: `Bearer ${token}` })
      .withBody({})
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
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
