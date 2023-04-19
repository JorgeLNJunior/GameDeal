import { PinoLogger } from '@infra/pino.logger'
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

  beforeEach(() => {
    validator = container.resolve(AddGameValidator)
    addGameRepository = container.resolve(AddGameRepository)
    isGameAlreadyInsertedRepository = container.resolve(
      IsGameAlreadyInsertedRepository
    )
    const logger = new PinoLogger()

    controller = new AddGameController(
      validator,
      addGameRepository,
      isGameAlreadyInsertedRepository,
      logger
    )
  })

  it('should return a CREATED response if it succeeds', async () => {
    const data = {
      title: 'title',
      id: 'id',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      gamers_gate_url: 'gamers_gate_url',
      created_at: new Date(),
      updated_at: new Date()
    }
    jest.spyOn(validator, 'validate').mockReturnValueOnce({ success: true })
    jest
      .spyOn(isGameAlreadyInsertedRepository, 'handle')
      .mockResolvedValueOnce(false)
    jest.spyOn(addGameRepository, 'add').mockResolvedValueOnce(data)

    const response = await controller.handle({
      body: {},
      headers: {},
      params: {},
      query: {}
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(data)
  })

  it('should return a BAD_REQUEST response if validation fails', async () => {
    jest.spyOn(validator, 'validate').mockReturnValueOnce({ success: false })

    const response = await controller.handle({
      body: {},
      headers: {},
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

    const response = await controller.handle({
      body: {},
      headers: {},
      params: {},
      query: {}
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return a INTERNAL_ERROR response if the repository fail', async () => {
    jest.spyOn(validator, 'validate').mockReturnValueOnce({ success: true })
    jest
      .spyOn(isGameAlreadyInsertedRepository, 'handle')
      .mockResolvedValueOnce(false)
    jest
      .spyOn(addGameRepository, 'add')
      .mockRejectedValueOnce(new Error('repository error'))

    const response = await controller.handle({
      body: {},
      headers: {},
      params: {},
      query: {}
    })

    expect(response.statusCode).toBe(500)
  })
})
