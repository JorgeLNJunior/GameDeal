import { DatabaseService } from '@database/database.service'
import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { FindGameByIdRepository } from '@shared/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@shared/getCurrentGamePrice.repository'
import { GameBuilder } from '@testing/builders/game.builder'
import { HttpRequestBuilder } from '@testing/builders/http/http.request.builder'
import { GamePriceBuilder } from '@testing/builders/price.builder'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { GetGamePriceController } from './getCurrentGamePrice.controller'

describe('GetGamePriceController', () => {
  let controller: GetGamePriceController
  let getCurrentGamePriceRepository: GetCurrentGamePriceRepository
  let findGameByIdRepository: FindGameByIdRepository
  let cache: ApplicationCache

  beforeEach(() => {
    const db = container.resolve(DatabaseService)

    getCurrentGamePriceRepository = new GetCurrentGamePriceRepository(db)
    findGameByIdRepository = new FindGameByIdRepository(db)
    cache = new FakeCache()

    controller = new GetGamePriceController(
      getCurrentGamePriceRepository,
      findGameByIdRepository,
      cache,
      new PinoLogger()
    )
  })

  it('should return a OK response an a price object', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()

    jest.spyOn(findGameByIdRepository, 'find').mockResolvedValueOnce(game)
    jest.spyOn(getCurrentGamePriceRepository, 'getPrice').mockResolvedValueOnce(price)

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(price)
  })

  it('should return a OK if cache is enabled', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()

    jest.spyOn(findGameByIdRepository, 'find').mockResolvedValueOnce(game)
    jest.spyOn(getCurrentGamePriceRepository, 'getPrice').mockResolvedValueOnce(price)
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: price,
      expires: 60
    })

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(price)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return a OK if cache is disabled', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()

    jest.spyOn(findGameByIdRepository, 'find').mockResolvedValueOnce(game)
    jest.spyOn(getCurrentGamePriceRepository, 'getPrice').mockResolvedValue(price)
    const cacheSpy = jest.spyOn(cache, 'get')

    const request = new HttpRequestBuilder()
      .withParams({ id: 'id' })
      .withHeaders({ 'cache-control': 'no-cache' })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(price)
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return a NOT_FOUND response if the game was not found', async () => {
    jest.spyOn(findGameByIdRepository, 'find').mockResolvedValueOnce(undefined)

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual({
      error: 'Not Found',
      message: 'Game not found'
    })
  })

  it('should return a INTERNAL_ERROR response if an exception was trown', async () => {
    jest.spyOn(findGameByIdRepository, 'find').mockRejectedValueOnce(new Error())

    const request = new HttpRequestBuilder().withParams({ id: 'id' }).build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
