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
    const data = {
      title: 'title',
      id: 'id',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: new Date()
    }
    jest.spyOn(validator, 'validate').mockReturnValueOnce({ success: true })
    jest
      .spyOn(isGameAlreadyInsertedRepository, 'handle')
      .mockResolvedValueOnce(false)
    jest.spyOn(addGameRepository, 'add').mockResolvedValueOnce(data)
    const token = await authService.getJwtToken()

    const response = await controller.handle({
      body: {},
      headers: {
        authorization: `Bearer ${token}`
      },
      params: {},
      query: {}
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(data)
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
      query: {}
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
      query: {}
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return UNAUTHORIZED if it did not receive an auth token', async () => {
    const response = await controller.handle({
      body: {},
      params: {},
      query: {},
      headers: {}
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
      }
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
      query: {}
    })

    expect(response.statusCode).toBe(500)
  })
})
