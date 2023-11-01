/* eslint-disable @typescript-eslint/no-explicit-any */
import { PinoLogger } from '@infra/pino.logger'
import { type ApplicationCache } from '@localtypes/http/cache.type'
import type { GameIgnoreList, QueryData } from '@packages/types'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { GetIgnoredGamesController } from './getIgnoredGames.controller'
import { GetIgnoredGamesRepository } from './repositories/getIgnoredGames.repository'

describe('GetIgnoredGamesController', () => {
  let controller: GetIgnoredGamesController
  let repository: GetIgnoredGamesRepository
  let cache: ApplicationCache

  beforeEach(() => {
    repository = container.resolve(GetIgnoredGamesRepository)
    cache = new FakeCache()
    const logger = new PinoLogger()

    controller = new GetIgnoredGamesController(repository, cache, logger)
  })

  it('should return a OK response if it succeeds', async () => {
    const data: GameIgnoreList[] = [
      { id: 'id', title: 'title' }
    ]
    const result: QueryData<GameIgnoreList[]> = {
      results: data,
      page: 1,
      totalPages: 10,
      count: 50
    }
    jest.spyOn(repository, 'get').mockResolvedValueOnce(result)

    const request = new HttpRequestBuilder().build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect((response.body as any).results[0]).toEqual(data[0])
  })

  it('should return a OK if cache is disabled', async () => {
    const data: GameIgnoreList[] = [
      { id: 'id', title: 'title' }
    ]
    const result: QueryData<GameIgnoreList[]> = {
      results: data,
      page: 1,
      totalPages: 10,
      count: 50
    }

    const request = new HttpRequestBuilder()
      .withHeaders({ 'cache-control': 'no-cache' })
      .build()

    jest.spyOn(repository, 'get').mockResolvedValueOnce(result)
    const cacheSpy = jest.spyOn(cache, 'get')

    const response = await controller.handle(request)

    expect((response.body as any).results[0]).toEqual(data[0])
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return a OK if cache is enabled', async () => {
    const data: GameIgnoreList[] = [
      { id: 'id', title: 'title' }
    ]
    const result: QueryData<GameIgnoreList[]> = {
      results: data,
      page: 1,
      totalPages: 10,
      count: 50
    }

    const request = new HttpRequestBuilder().build()

    jest.spyOn(repository, 'get').mockResolvedValueOnce(result)
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: result,
      expires: 60
    })

    const response = await controller.handle(request)

    expect((response.body as any).results[0]).toEqual(data[0])
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return a INTERNAL_ERROR response if something throw', async () => {
    jest.spyOn(repository, 'get').mockRejectedValueOnce(new Error())

    const request = new HttpRequestBuilder().build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
