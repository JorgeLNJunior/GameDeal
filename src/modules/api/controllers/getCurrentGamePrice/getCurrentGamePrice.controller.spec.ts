import { DatabaseService } from '@database/database.service'
import { PinoLogger } from '@infra/pino.logger'
import { Game, GamePrice } from '@localtypes/entities.type'
import { ApplicationCache } from '@localtypes/http/cache.type'
import { FindGameByIdRepository } from '@modules/shared/repositories/findGameById.repository'
import { GetCurrentGamePriceRepository } from '@modules/shared/repositories/getCurrentGamePrice.repository'
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
    const game: Game = {
      id: 'id',
      title: 'Cyberpunk 2077',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: null
    }
    const price: GamePrice = {
      id: 'id',
      game_id: 'id',
      steam_price: 10,
      nuuvem_price: 20,
      created_at: new Date(),
      updated_at: null
    }
    jest
      .spyOn(findGameByIdRepository, 'find')
      .mockImplementationOnce(() => Promise.resolve(game))

    jest
      .spyOn(getCurrentGamePriceRepository, 'getPrice')
      .mockImplementationOnce(() => Promise.resolve(price))

    const response = await controller.handle({
      params: {
        id: '1'
      },
      query: {},
      body: {},
      headers: {},
      url: ''
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(price)
  })

  it('should return a OK if cache is enabled', async () => {
    const game: Game = {
      id: 'id',
      title: 'Cyberpunk 2077',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: null
    }
    const price: GamePrice = {
      id: 'id',
      game_id: 'id',
      steam_price: 10,
      nuuvem_price: 20,
      created_at: new Date(),
      updated_at: null
    }
    jest
      .spyOn(findGameByIdRepository, 'find')
      .mockImplementationOnce(() => Promise.resolve(game))
    jest
      .spyOn(getCurrentGamePriceRepository, 'getPrice')
      .mockImplementationOnce(() => Promise.resolve(price))
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: price,
      expires: 60
    })

    const response = await controller.handle({
      params: {
        id: '1'
      },
      query: {},
      body: {},
      headers: {},
      url: ''
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(price)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return a OK if cache is disabled', async () => {
    const game: Game = {
      id: 'id',
      title: 'Cyberpunk 2077',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: null
    }
    const price: GamePrice = {
      id: 'id',
      game_id: 'id',
      steam_price: 10,
      nuuvem_price: 20,
      created_at: new Date(),
      updated_at: null
    }
    jest
      .spyOn(findGameByIdRepository, 'find')
      .mockImplementationOnce(() => Promise.resolve(game))
    jest
      .spyOn(getCurrentGamePriceRepository, 'getPrice')
      .mockImplementationOnce(() => Promise.resolve(price))
    const cacheSpy = jest.spyOn(cache, 'get')

    const response = await controller.handle({
      params: {
        id: '1'
      },
      query: {},
      body: {},
      headers: {
        'cache-control': 'no-cache'
      },
      url: ''
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(price)
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return a NOT_FOUND response if the game was not found', async () => {
    jest.spyOn(findGameByIdRepository, 'find').mockResolvedValueOnce(undefined)

    const response = await controller.handle({
      params: {
        id: 'not-found'
      },
      query: {},
      body: {},
      headers: {},
      url: ''
    })

    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual({
      error: 'Not Found',
      message: 'Game not found'
    })
  })

  it('should return a INTERNAL_ERROR response if an exception was trown', async () => {
    jest
      .spyOn(findGameByIdRepository, 'find')
      .mockRejectedValueOnce(new Error('repository error'))

    const response = await controller.handle({
      params: {
        id: 'id'
      },
      query: {},
      body: {},
      headers: {},
      url: ''
    })

    expect(response.statusCode).toBe(500)
  })
})
