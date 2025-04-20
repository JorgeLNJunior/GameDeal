import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { GamePriceBuilder } from '@packages/testing'
import { type LowestPrice } from '@packages/types'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { GetLowestPriceController } from './getLowestPrice.controller'
import { GetLowestPriceRepository } from './repositories/getLowestPrice.repository'

describe('GetLowestPriceController', () => {
  let controller: GetLowestPriceController
  let getLowestPriceRepo: GetLowestPriceRepository
  let isGameExistRepo: IsGameExistRepository
  let cache: ApplicationCache

  beforeEach(async () => {
    cache = new FakeCache()
    getLowestPriceRepo = container.resolve(
      GetLowestPriceRepository
    )
    isGameExistRepo = container.resolve(IsGameExistRepository)
    controller = new GetLowestPriceController(
      getLowestPriceRepo,
      isGameExistRepo,
      cache,
      new PinoLogger()
    )
  })

  it('should return OK and a price', async () => {
    const data = new GamePriceBuilder().build()
    const price: LowestPrice = {
      steam: { price: data.steam_price, date: data.date },
      nuuvem: { price: data.nuuvem_price, date: data.date },
      green_man_gaming: { price: data.green_man_gaming_price, date: data.date }
    }

    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getLowestPriceRepo, 'get').mockResolvedValueOnce(price)

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

     
    expect(response.body).toEqual(price)
    expect(response.statusCode).toBe(200)
  })

  it('should return OK if cache is enabled', async () => {
    const data = new GamePriceBuilder().build()
    const price: LowestPrice = {
      steam: { price: data.steam_price, date: data.date },
      nuuvem: { price: data.nuuvem_price, date: data.date },
      green_man_gaming: { price: data.green_man_gaming_price, date: data.date }
    }

    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: price,
      expires: 60
    })

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

     
    expect(response.body).toEqual(price)
    expect(response.statusCode).toBe(200)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return OK if cache is disabled', async () => {
    const data = new GamePriceBuilder().build()
    const price: LowestPrice = {
      steam: { price: data.steam_price, date: data.date },
      nuuvem: { price: data.nuuvem_price, date: data.date },
      green_man_gaming: { price: data.green_man_gaming_price, date: data.date }
    }

    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getLowestPriceRepo, 'get').mockResolvedValueOnce(price)
    const cacheSpy = jest.spyOn(cache, 'get')

    const request = new HttpRequestBuilder()
      .withParams({ id: 'id' })
      .withHeaders({ 'cache-control': 'no-cache' })
      .build()
    const response = await controller.handle(request)

     
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
