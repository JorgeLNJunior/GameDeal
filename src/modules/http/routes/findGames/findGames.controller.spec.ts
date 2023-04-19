import { PinoLogger } from '@infra/pino.logger'
import { container } from 'tsyringe'

import { FindGamesController } from './findGames.controller'
import { FindGamesRepository } from './repositories/findGames.repository'

describe('FindGamesController', () => {
  let controller: FindGamesController
  let repository: FindGamesRepository

  beforeEach(async () => {
    repository = container.resolve(FindGamesRepository)
    controller = new FindGamesController(repository, new PinoLogger())
  })

  it('should return a OK reponse and a list of games', async () => {
    const game = {
      title: 'title',
      id: 'id',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      gamers_gate_url: 'gamers_gate_url',
      created_at: new Date(),
      updated_at: new Date()
    }

    jest.spyOn(repository, 'find').mockResolvedValueOnce([game])

    const response = await controller.handle()

    expect((response.body as Array<unknown>)[0]).toMatchObject(game)
  })

  it('should return a INTERNAL_ERROR reponse if an exception was trown', async () => {
    jest
      .spyOn(repository, 'find')
      .mockRejectedValueOnce(new Error('repository error'))

    const response = await controller.handle()

    expect(response.statusCode).toBe(500)
  })
})
