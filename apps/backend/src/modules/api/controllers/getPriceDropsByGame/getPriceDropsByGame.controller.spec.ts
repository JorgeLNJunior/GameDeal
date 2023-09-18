/* eslint-disable @typescript-eslint/no-explicit-any */
import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { GamePriceDropBuilder } from '@packages/testing'
import type { GamePriceDrop, QueryData } from '@packages/types'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { GetPriceDropsByGameController } from './getPriceDropsByGame.controller'
import { GetPriceDropsByGameRepository } from './repositories/getPriceDropsByGame.repository'

describe('GetPriceDropsByGameController', () => {
  let controller: GetPriceDropsByGameController
  let getDropsRepo: GetPriceDropsByGameRepository
  let isGameExistRepo: IsGameExistRepository
  let cache: ApplicationCache

  beforeEach(async () => {
    cache = new FakeCache()
    getDropsRepo = container.resolve(GetPriceDropsByGameRepository)
    isGameExistRepo = container.resolve(IsGameExistRepository)
    controller = new GetPriceDropsByGameController(
      getDropsRepo,
      isGameExistRepo,
      cache,
      new PinoLogger()
    )
  })

  it('should return a OK response and a list of price drops', async () => {
    const drops = [new GamePriceDropBuilder().build()]
    const result: QueryData<GamePriceDrop[]> = {
      results: drops,
      page: 1,
      totalPages: 10,
      count: 50
    }
    const request = new HttpRequestBuilder()
      .withParams({ id: drops[0].game_id })
      .build()

    jest.spyOn(getDropsRepo, 'get').mockResolvedValueOnce(result)
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)

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
    const request = new HttpRequestBuilder()
      .withParams({ id: drops[0].game_id })
      .build()

    jest.spyOn(getDropsRepo, 'get').mockResolvedValueOnce(result)
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
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
      .withParams({ id: drops[0].game_id })
      .build()

    jest.spyOn(getDropsRepo, 'get').mockResolvedValueOnce(result)
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(true)
    const cacheSpy = jest.spyOn(cache, 'get')

    const response = await controller.handle(request)

    expect((response.body as any).results[0]).toMatchObject(drops[0])
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return a NOT_FOUND response if the game does not exist', async () => {
    const request = new HttpRequestBuilder()
      .withParams({ id: 'invalid-id' })
      .build()

    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(false)

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
  })

  it('should return a INTERNAL_ERROR response if an exception was thrown', async () => {
    const request = new HttpRequestBuilder().build()

    jest.spyOn(isGameExistRepo, 'get').mockRejectedValueOnce(new Error())

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
