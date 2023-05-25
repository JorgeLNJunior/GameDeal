import { PinoLogger } from '@infra/pino.logger'
import { ApplicationCache } from '@localtypes/http/cache.type'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { FindGamesController } from './findGames.controller'
import { FindGamesRepository } from './repositories/findGames.repository'

describe('FindGamesController', () => {
  let controller: FindGamesController
  let repository: FindGamesRepository
  let cache: ApplicationCache

  beforeEach(async () => {
    cache = new FakeCache()
    repository = container.resolve(FindGamesRepository)
    controller = new FindGamesController(repository, cache, new PinoLogger())
  })

  it('should return a OK reponse and a list of games', async () => {
    const game = {
      title: 'title',
      id: 'id',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: new Date()
    }
    const result = { results: [game], pages: 1 }
    const request = {
      query: {},
      headers: {},
      body: {},
      params: {},
      url: ''
    }

    jest.spyOn(repository, 'find').mockResolvedValueOnce(result)

    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toMatchObject(game)
  })

  it('should return a INTERNAL_ERROR reponse if an exception was trown', async () => {
    const request = {
      query: {},
      headers: {},
      body: {},
      params: {},
      url: ''
    }
    jest
      .spyOn(repository, 'find')
      .mockRejectedValueOnce(new Error('repository error'))

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
