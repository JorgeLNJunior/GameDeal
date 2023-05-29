import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { HttpRequestBuilder } from '@testing/builders/http/http.request.builder'
import { GamePriceBuilder } from '@testing/builders/price.builder'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { GetGamePriceHistoryController } from './getGamePriceHistory.controller'
import { GetGamePriceHistoryRepository } from './repositories/getGamePriceHistory.repository'
import { IsGameExistRepository } from './repositories/isGameExist.repository'

describe('GetGamePriceHistoryController', () => {
  let controller: GetGamePriceHistoryController
  let getGamePriceHistoryRepo: GetGamePriceHistoryRepository
  let isGameExistRepo: IsGameExistRepository
  let cache: ApplicationCache

  beforeEach(async () => {
    cache = new FakeCache()
    getGamePriceHistoryRepo = container.resolve(GetGamePriceHistoryRepository)
    isGameExistRepo = container.resolve(IsGameExistRepository)
    controller = new GetGamePriceHistoryController(
      getGamePriceHistoryRepo,
      isGameExistRepo,
      cache,
      new PinoLogger()
    )
  })

  it('should return OK and the price history of a game', async () => {
    const price = new GamePriceBuilder().build()
    const data = {
      results: [price],
      pages: 10
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getGamePriceHistoryRepo, 'get').mockResolvedValueOnce(data)

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toEqual(data.results[0])
    expect(response.statusCode).toBe(200)
  })

  it('should return OK if cache is enabled', async () => {
    const price = new GamePriceBuilder().build()
    const data = {
      results: [price],
      pages: 10
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: data,
      expires: 60
    })

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toEqual(data.results[0])
    expect(response.statusCode).toBe(200)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return OK if cache is disabled', async () => {
    const price = new GamePriceBuilder().build()
    const data = {
      results: [price],
      pages: 10
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getGamePriceHistoryRepo, 'get').mockResolvedValueOnce(data)
    const cacheSpy = jest.spyOn(cache, 'get')

    const request = new HttpRequestBuilder()
      .withParams({ id: 'id' })
      .withHeaders({ 'cache-control': 'no-cache' })
      .build()
    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toEqual(data.results[0])
    expect(response.statusCode).toBe(200)
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return NOT_FOUND if the game does not exist', async () => {
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(false)

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
  })
})
