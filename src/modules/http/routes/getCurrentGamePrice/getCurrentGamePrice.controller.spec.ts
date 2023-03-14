import { DatabaseService } from '@database/database.service'
import { Game, GamePrice } from '@localtypes/entities.type'
import { FindGameByIdRepository } from '@modules/shared/repositories/findGameById.repository'
import { container } from 'tsyringe'

import { GetGamePriceController } from './getCurrentGamePrice.controller'
import { GetCurrentGamePriceRepository } from './repositories/getCurrentGamePrice.repository'

describe('GetGamePriceController', () => {
  let controller: GetGamePriceController
  let getCurrentGamePriceRepository: GetCurrentGamePriceRepository
  let findGameByIdRepository: FindGameByIdRepository

  beforeEach(() => {
    const db = container.resolve(DatabaseService)

    getCurrentGamePriceRepository = new GetCurrentGamePriceRepository(db)
    findGameByIdRepository = new FindGameByIdRepository(db)

    controller = new GetGamePriceController(
      getCurrentGamePriceRepository,
      findGameByIdRepository
    )
  })

  it('should return 404 if the game is not found', async () => {
    jest.spyOn(findGameByIdRepository, 'find').mockResolvedValueOnce(undefined)

    const response = await controller.handle({
      params: {
        id: 'not-found'
      },
      query: {},
      body: {},
      headers: {}
    })

    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual({
      error: 'Not Found',
      message: 'Game not found'
    })
  })

  it('should return a price object', async () => {
    const game: Game = {
      id: 'id',
      title: 'Cyberpunk 2077',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url',
      green_man_gaming_url: 'green_man_gaming_url',
      created_at: new Date(),
      updated_at: null
    }
    const price: GamePrice = {
      id: 'id',
      game_id: 'id',
      steam_price: 10,
      nuuvem_price: null,
      green_man_gaming_price: null,
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
      headers: {}
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(price)
  })
})
