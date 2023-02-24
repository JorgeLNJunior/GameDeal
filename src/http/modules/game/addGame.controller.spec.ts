import 'reflect-metadata'

import { container } from 'tsyringe'

import { PinoLogger } from '../../../infra/logger'
import { AddGameController } from './addGame.controller'
import { GameRepository } from './game.repository'
import { AddGameValidator } from './validators/addGame.validator'

describe('AddGameController', () => {
  let controller: AddGameController
  let validator: AddGameValidator
  let repository: GameRepository

  beforeEach(() => {
    validator = container.resolve(AddGameValidator)
    repository = container.resolve(GameRepository)
    const logger = new PinoLogger()

    controller = new AddGameController(validator, repository, logger)
  })

  it('should return a OK response if it succeeds', async () => {
    const data = {
      title: 'title',
      id: 'id',
      steam_url: 'steam_url',
      green_man_gaming_url: 'green_man_gaming_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: new Date()
    }
    jest.spyOn(validator, 'validate').mockReturnValue({ success: true })
    jest.spyOn(repository, 'isAlreadyInserted').mockResolvedValue(false)
    jest.spyOn(repository, 'create').mockResolvedValue(data)

    const response = await controller.handle({
      body: {},
      headers: {},
      params: {},
      query: {}
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ game: data })
  })

  it('should return a BAD_REQUEST response if validation fails', async () => {
    jest.spyOn(validator, 'validate').mockReturnValue({ success: false })

    const response = await controller.handle({
      body: {},
      headers: {},
      params: {},
      query: {}
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return a BAD_REQUEST response if the game is already inserted', async () => {
    jest.spyOn(validator, 'validate').mockReturnValue({ success: true })
    jest.spyOn(repository, 'isAlreadyInserted').mockResolvedValue(true)
    jest.spyOn(repository, 'create').mockRejectedValue({} as never)

    const response = await controller.handle({
      body: {},
      headers: {},
      params: {},
      query: {}
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return a INTERNAL_ERROR response if repository fails', async () => {
    jest.spyOn(validator, 'validate').mockReturnValue({ success: true })
    jest.spyOn(repository, 'isAlreadyInserted').mockResolvedValue(false)
    jest
      .spyOn(repository, 'create')
      .mockRejectedValue(new Error('repository error'))

    const response = await controller.handle({
      body: {},
      headers: {},
      params: {},
      query: {}
    })

    expect(response.statusCode).toBe(500)
  })
})
