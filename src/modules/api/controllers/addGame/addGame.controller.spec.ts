import { PinoLogger } from '@infra/pino.logger'
import { AuthService } from '@shared/services/auth.service'
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
    const game = {
      id: 'id',
      title: 'God of War',
      steam_url: 'url',
      nuuvem_url: 'url',
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(validator, 'validate').mockReturnValueOnce({ success: true })
    jest
      .spyOn(isGameAlreadyInsertedRepository, 'handle')
      .mockResolvedValueOnce(false)
    jest.spyOn(addGameRepository, 'add').mockResolvedValueOnce(game)
    const token = await authService.getJwtToken()

    const response = await controller.handle({
      body: {},
      headers: {
        authorization: `Bearer ${token}`
      },
      params: {},
      query: {},
      url: ''
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(game)
  })

  it('should return a BAD_REQUEST response if validation fails', async () => {
    jest.spyOn(validator, 'validate').mockReturnValueOnce({ success: false })
    const token = await authService.getJwtToken()

    const response = await controller.handle({
      body: {},
      headers: {
        authorization: `Bearer ${token}`
      },
      params: {},
      query: {},
      url: ''
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return a BAD_REQUEST response if the game is already inserted', async () => {
    jest.spyOn(validator, 'validate').mockReturnValueOnce({ success: true })
    jest
      .spyOn(isGameAlreadyInsertedRepository, 'handle')
      .mockResolvedValueOnce(true)
    jest.spyOn(addGameRepository, 'add').mockRejectedValueOnce({} as unknown)
    const token = await authService.getJwtToken()

    const response = await controller.handle({
      body: {},
      headers: {
        authorization: `Bearer ${token}`
      },
      params: {},
      query: {},
      url: ''
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return UNAUTHORIZED if it did not receive an auth token', async () => {
    const response = await controller.handle({
      body: {},
      params: {},
      query: {},
      headers: {},
      url: ''
    })

    expect(response.statusCode).toBe(401)
  })

  it('should return UNAUTHORIZED if it received an invalid auth token', async () => {
    jest.spyOn(authService, 'verifyToken').mockResolvedValueOnce({
      isValid: false,
      error: 'invalid token'
    })

    const response = await controller.handle({
      body: {},
      params: {},
      query: {},
      headers: {
        authorization: 'Bearer invalid.token'
      },
      url: ''
    })

    expect(response.statusCode).toBe(401)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).message).toBe('invalid token')
  })

  it('should return a INTERNAL_ERROR response if something throw', async () => {
    jest.spyOn(validator, 'validate').mockReturnValueOnce({ success: true })
    jest
      .spyOn(isGameAlreadyInsertedRepository, 'handle')
      .mockResolvedValueOnce(false)
    jest
      .spyOn(addGameRepository, 'add')
      .mockRejectedValueOnce(new Error('repository error'))

    const token = await authService.getJwtToken()

    const response = await controller.handle({
      body: {},
      headers: {
        authorization: `Bearer ${token}`
      },
      params: {},
      query: {},
      url: ''
    })

    expect(response.statusCode).toBe(500)
  })
})
