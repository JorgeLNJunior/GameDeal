import { PinoLogger } from '@infra/pino.logger'
import { ApplicationCache } from '@localtypes/http/cache.type'
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
    const price = {
      results: [
        {
          id: 'id',
          game_id: 'game_id',
          steam_price: 100.55,
          nuuvem_price: 120.0,
          created_at: new Date(),
          updated_at: null
        }
      ],
      pages: 10
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getGamePriceHistoryRepo, 'get').mockResolvedValueOnce(price)

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'id' },
      url: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toEqual(price.results[0])
    expect(response.statusCode).toBe(200)
  })

  it('should return OK if cache is enabled', async () => {
    const price = {
      results: [
        {
          id: 'id',
          game_id: 'game_id',
          steam_price: 100.55,
          nuuvem_price: 120.0,
          created_at: new Date(),
          updated_at: null
        }
      ],
      pages: 10
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getGamePriceHistoryRepo, 'get').mockResolvedValueOnce(price)
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
    expect((response.body as any).results[0]).toEqual(price.results[0])
    expect(response.statusCode).toBe(200)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return OK if cache is disabled', async () => {
    const price = {
      results: [
        {
          id: 'id',
          game_id: 'game_id',
          steam_price: 100.55,
          nuuvem_price: 120.0,
          created_at: new Date(),
          updated_at: null
        }
      ],
      pages: 10
    }
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    jest.spyOn(getGamePriceHistoryRepo, 'get').mockResolvedValueOnce(price)
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
    expect((response.body as any).results[0]).toEqual(price.results[0])
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
