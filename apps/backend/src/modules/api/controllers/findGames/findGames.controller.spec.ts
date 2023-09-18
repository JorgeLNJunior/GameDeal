import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { GameBuilder } from '@packages/testing'
import { type Game, type QueryData } from '@packages/types'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
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

  it('should return a OK response and a list of games', async () => {
    const games = [new GameBuilder().build()]
    const result: QueryData<Game[]> = {
      results: games,
      page: 1,
      totalPages: 10,
      count: 50
    }
    const request = new HttpRequestBuilder().build()

    jest.spyOn(repository, 'find').mockResolvedValueOnce(result)

    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toMatchObject(games[0])
  })

  it('should return a OK if cache is enabled', async () => {
    const games = [new GameBuilder().build()]
    const result: QueryData<Game[]> = {
      results: games,
      page: 1,
      totalPages: 10,
      count: 50
    }
    const request = new HttpRequestBuilder().build()

    jest.spyOn(repository, 'find').mockResolvedValueOnce(result)
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: result,
      expires: 60
    })

    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toMatchObject(games[0])
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return a OK if cache is disabled', async () => {
    const games = [new GameBuilder().build()]
    const result: QueryData<Game[]> = {
      results: games,
      page: 1,
      totalPages: 10,
      count: 50
    }
    const request = new HttpRequestBuilder()
      .withHeaders({ 'cache-control': 'no-cache' })
      .build()

    jest.spyOn(repository, 'find').mockResolvedValueOnce(result)
    const cacheSpy = jest.spyOn(cache, 'get')

    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toMatchObject(games[0])
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return a INTERNAL_ERROR response if an exception was thrown', async () => {
    const request = new HttpRequestBuilder().build()

    jest.spyOn(repository, 'find').mockRejectedValueOnce(new Error())

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
