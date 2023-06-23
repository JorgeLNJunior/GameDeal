import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { HttpRequestBuilder } from '@testing/builders/http/http.request.builder'
import { GamePriceBuilder } from '@testing/builders/price.builder'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { GetLowestHistoricalPriceController } from './getLowestHistoricalPrice.controller'
import { GetLowestHistoricalPriceRepository } from './repositories/getLowestHistoricalPrice.repository'

describe('GetLowestHistoricalPriceController', () => {
  let controller: GetLowestHistoricalPriceController
  let getLowestHistoricalPriceRepo: GetLowestHistoricalPriceRepository
  let isGameExistRepo: IsGameExistRepository
  let cache: ApplicationCache

  beforeEach(async () => {
    cache = new FakeCache()
    getLowestHistoricalPriceRepo = container.resolve(
      GetLowestHistoricalPriceRepository
    )
    isGameExistRepo = container.resolve(IsGameExistRepository)
    controller = new GetLowestHistoricalPriceController(
      getLowestHistoricalPriceRepo,
      isGameExistRepo,
      cache,
      new PinoLogger()
    )
  })

  it('should return OK and a price', async () => {
    const price = new GamePriceBuilder().build()

    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getLowestHistoricalPriceRepo, 'get').mockResolvedValueOnce(price)

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(response.body).toEqual(price)
    expect(response.statusCode).toBe(200)
  })

  it('should return OK if cache is enabled', async () => {
    const price = new GamePriceBuilder().build()

    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: price,
      expires: 60
    })

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(response.body).toEqual(price)
    expect(response.statusCode).toBe(200)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return OK if cache is disabled', async () => {
    const price = new GamePriceBuilder().build()

    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getLowestHistoricalPriceRepo, 'get').mockResolvedValueOnce(price)
    const cacheSpy = jest.spyOn(cache, 'get')

    const request = new HttpRequestBuilder()
      .withParams({ id: 'id' })
      .withHeaders({ 'cache-control': 'no-cache' })
      .build()
    const response = await controller.handle(request)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(response.body).toEqual(price)
    expect(response.statusCode).toBe(200)
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return NOT_FOUND if the game does not exist', async () => {
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(false)

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
  })

  it('should return INTERNAL_ERROR if something throw', async () => {
    jest.spyOn(isGameExistRepo, 'get').mockRejectedValueOnce(new Error())

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
