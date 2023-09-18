import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { CountGamesController } from './countGames.controller'
import { CountGamesRepository } from './repositories/countGames.repository'

describe('CountGamesController', () => {
  let controller: CountGamesController
  let countRepository: CountGamesRepository
  let cache: ApplicationCache

  beforeEach(async () => {
    cache = new FakeCache()
    countRepository = container.resolve(CountGamesRepository)
    controller = new CountGamesController(
      countRepository,
      cache,
      new PinoLogger()
    )
  })

  it('should return a OK response and a total property', async () => {
    const total = 28
    const request = new HttpRequestBuilder().build()

    jest.spyOn(countRepository, 'count').mockResolvedValueOnce(total)

    const response = await controller.handle(request)

    expect(response.body).toEqual({ total })
  })

  it('should return a OK if cache is enabled', async () => {
    const total = 28
    const request = new HttpRequestBuilder().build()

    jest.spyOn(countRepository, 'count').mockResolvedValueOnce(total)
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: { total },
      expires: 60
    })

    const response = await controller.handle(request)

    expect(cacheSpy).toHaveBeenCalled()
    expect(response.body).toEqual({ total })
  })

  it('should return a OK if cache is disabled', async () => {
    const total = 28
    const request = new HttpRequestBuilder()
      .withHeaders({ 'cache-control': 'no-cache' })
      .build()

    jest.spyOn(countRepository, 'count').mockResolvedValueOnce(total)
    const cacheSpy = jest.spyOn(cache, 'get')

    const response = await controller.handle(request)

    expect(cacheSpy).not.toHaveBeenCalled()
    expect(response.body).toEqual({ total })
  })

  it('should return a INTERNAL_ERROR response if an exception was thrown', async () => {
    const request = new HttpRequestBuilder().build()

    jest.spyOn(countRepository, 'count').mockRejectedValueOnce(new Error())

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
