import { AuthService } from '@api/internal/auth.service'
import { PinoLogger } from '@infra/pino.logger'
import { GameBuilder } from '@testing/builders/game.builder'
import { HttpRequestBuilder } from '@testing/builders/http/http.request.builder'
import { container } from 'tsyringe'

import { AddGameController } from './addGame.controller'
import { AddGameRepository } from './repositories/addGame.repository'
import { IsGameAlreadyInsertedRepository } from './repositories/isGameAlreadyInserted.repository'
import { AddGameValidator } from './validator/addGame.validator'

describe('AddGameController', () => {
  let controller: AddGameController
  let validator: AddGameValidator
  let addGameRepository: AddGameRepository
  let isGameAlreadyInsertedRepository: IsGameAlreadyInsertedRepository
  let authService: AuthService

  beforeEach(() => {
    validator = container.resolve(AddGameValidator)
    addGameRepository = container.resolve(AddGameRepository)
    isGameAlreadyInsertedRepository = container.resolve(
      IsGameAlreadyInsertedRepository
    )
    authService = container.resolve(AuthService)
    const logger = new PinoLogger()

    controller = new AddGameController(
      validator,
      addGameRepository,
      isGameAlreadyInsertedRepository,
      authService,
      logger
    )
  })

  it('should return a CREATED response if it succeeds', async () => {
    const game = new GameBuilder().build()

    jest.spyOn(isGameAlreadyInsertedRepository, 'handle').mockResolvedValueOnce(false)
    jest.spyOn(addGameRepository, 'add').mockResolvedValueOnce(game)

    const token = await authService.getJwtToken()
    const request = new HttpRequestBuilder()
      .withHeaders({ authorization: `Bearer ${token}` })
      .withBody(game)
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(game)
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

  it('should return a BAD_REQUEST response if the game is already inserted', async () => {
    const game = new GameBuilder().build()

    jest.spyOn(isGameAlreadyInsertedRepository, 'handle').mockResolvedValueOnce(true)

    const token = await authService.getJwtToken()
    const request = new HttpRequestBuilder()
      .withBody(game)
      .withHeaders({ authorization: `Bearer ${token}` })
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
