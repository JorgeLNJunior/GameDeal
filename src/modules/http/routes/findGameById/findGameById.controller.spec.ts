import { PinoLogger } from '@infra/pino.logger'
import { FindGameByIdRepository } from '@modules/shared/repositories/findGameById.repository'
import { container } from 'tsyringe'

import { FindGameByIdController } from './findGameById.controller'

describe('FindGameByIdController', () => {
  let controller: FindGameByIdController
  let repository: FindGameByIdRepository

  beforeEach(async () => {
    repository = container.resolve(FindGameByIdRepository)
    controller = new FindGameByIdController(repository, new PinoLogger())
  })

  it('should return a OK reponse', async () => {
    const game = {
      id: 'id',
      title: 'title',
      steam_url: 'stem_url',
      nuuvem_url: 'nuuvem_url',
      gamers_gate_url: 'gamers_gate_url',
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(repository, 'find').mockResolvedValueOnce(game)

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: game.id }
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(game)
  })

  it('should return a NOT_FOUND response if the game was not found', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce(undefined)

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'id' }
    })

    console.log(response.body)

    expect(response.statusCode).toBe(404)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).message).toBe('game not found')
  })

  it('should return a INTERNAL_ERROR response if an exception was thrown', async () => {
    jest
      .spyOn(repository, 'find')
      .mockRejectedValueOnce(new Error('repository error'))

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'id' }
    })

    expect(response.statusCode).toBe(500)
  })
})
