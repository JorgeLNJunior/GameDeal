import { PinoLogger } from '@infra/pino.logger'
import { ApplicationCache } from '@localtypes/http/cache.type'
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
    const price = {
      id: 'id',
      game_id: 'game_id',
      steam_price: 100.55,
      nuuvem_price: 120.0,
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getLowestHistoricalPriceRepo, 'get').mockResolvedValueOnce(price)

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'id' },
      url: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(response.body).toEqual(price)
    expect(response.statusCode).toBe(200)
  })

  it('should return OK if cache is enabled', async () => {
    const price = {
      id: 'id',
      game_id: 'game_id',
      steam_price: 100.55,
      nuuvem_price: 120.0,
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getLowestHistoricalPriceRepo, 'get').mockResolvedValueOnce(price)
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: price,
      expires: 60
    })

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'id' },
      url: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(response.body).toEqual(price)
    expect(response.statusCode).toBe(200)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return OK if cache is disabled', async () => {
    const price = {
      id: 'id',
      game_id: 'game_id',
      steam_price: 100.55,
      nuuvem_price: 120.0,
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getLowestHistoricalPriceRepo, 'get').mockResolvedValueOnce(price)
    const cacheSpy = jest.spyOn(cache, 'get')

    const response = await controller.handle({
      body: {},
      headers: {
        'cache-control': 'no-cache'
      },
      query: {},
      params: { id: 'id' },
      url: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(response.body).toEqual(price)
    expect(response.statusCode).toBe(200)
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return NOT_FOUND if the game does not exist', async () => {
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(false)

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'invalid-id' },
      url: ''
    })

    expect(response.statusCode).toBe(404)
  })
})
