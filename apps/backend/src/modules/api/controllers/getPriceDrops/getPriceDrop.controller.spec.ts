/* eslint-disable @typescript-eslint/no-explicit-any */
import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { GamePriceDropBuilder } from '@packages/testing'
import type { GamePriceDrop, QueryData } from '@packages/types'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { GetPriceDropsController } from './getPriceDrop.controller'
import { GetPriceDropsRepository } from './repositories/getPriceDrops.repository'

describe('GetPriceDropsController', () => {
  let controller: GetPriceDropsController
  let repository: GetPriceDropsRepository
  let cache: ApplicationCache

  beforeEach(async () => {
    cache = new FakeCache()
    repository = container.resolve(GetPriceDropsRepository)
    controller = new GetPriceDropsController(repository, cache, new PinoLogger())
  })

  it('should return a OK response and a list of price drops', async () => {
    const drops = [new GamePriceDropBuilder().build()]
    const result: QueryData<GamePriceDrop[]> = {
      results: drops,
      page: 1,
      totalPages: 10,
      count: 50
    }
    const request = new HttpRequestBuilder().build()

    jest.spyOn(repository, 'get').mockResolvedValueOnce(result)

    const response = await controller.handle(request)

    expect((response.body as any).results[0]).toMatchObject(drops[0])
  })

  it('should return a OK if cache is enabled', async () => {
    const drops = [new GamePriceDropBuilder().build()]
    const result: QueryData<GamePriceDrop[]> = {
      results: drops,
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

    expect((response.body as any).results[0]).toMatchObject(drops[0])
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return a OK if cache is disabled', async () => {
    const drops = [new GamePriceDropBuilder().build()]
    const result: QueryData<GamePriceDrop[]> = {
      results: drops,
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

    expect((response.body as any).results[0]).toMatchObject(drops[0])
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return a INTERNAL_ERROR response if an exception was thrown', async () => {
    const request = new HttpRequestBuilder().build()

    jest.spyOn(repository, 'get').mockRejectedValueOnce(new Error())

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
