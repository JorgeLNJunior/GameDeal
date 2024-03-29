import { AuthService } from '@api/internal/auth.service'
import ConfigService from '@config/config.service'
import { PinoLogger } from '@infra/pino.logger'
import { GameBuilder } from '@packages/testing'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
import { container } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { DeleteGameController } from './deleteGame.controller'
import { DeleteGameRepository } from './repositories/deleteGame.repository'

describe('DeleteGameController', () => {
  let controller: DeleteGameController
  let authService: AuthService
  let isGameExistRepo: IsGameExistRepository
  let deleteGameRepo: DeleteGameRepository

  beforeEach(() => {
    const logger = new PinoLogger()
    const config = new ConfigService(logger)

    authService = new AuthService(config)
    isGameExistRepo = container.resolve(IsGameExistRepository)
    deleteGameRepo = container.resolve(DeleteGameRepository)

    controller = new DeleteGameController(
      authService, isGameExistRepo, deleteGameRepo, logger
    )
  })

  it('should return a OK response if it succeeds', async () => {
    const game = new GameBuilder().build()

    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(deleteGameRepo, 'delete').mockResolvedValueOnce()

    const token = await authService.getJwtToken()
    const request = new HttpRequestBuilder()
      .withHeaders({ authorization: `Bearer ${token}` })
      .withParams({ id: game.id })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      message: 'the game has been deleted'
    })
  })

  it('should return a NOT_FOUND response if the game was not found', async () => {
    const game = new GameBuilder().build()

    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(false)
    jest.spyOn(deleteGameRepo, 'delete').mockResolvedValueOnce()

    const token = await authService.getJwtToken()
    const request = new HttpRequestBuilder()
      .withHeaders({ authorization: `Bearer ${token}` })
      .withParams({ id: game.id })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
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
