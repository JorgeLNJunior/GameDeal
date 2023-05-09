import { container } from 'tsyringe'

import { GetGamePriceHistoryController } from './getGamePriceHistory.controller'
import { GetGamePriceHistoryRepository } from './repositories/getGamePriceHistory.repository'
import { IsGameExistRepository } from './repositories/isGameExist.repository'

describe('GetGamePriceHistoryController', () => {
  let controller: GetGamePriceHistoryController
  let getGamePriceHistoryRepo: GetGamePriceHistoryRepository
  let isGameExistRepo: IsGameExistRepository

  beforeEach(async () => {
    getGamePriceHistoryRepo = container.resolve(GetGamePriceHistoryRepository)
    isGameExistRepo = container.resolve(IsGameExistRepository)
    controller = new GetGamePriceHistoryController(
      getGamePriceHistoryRepo,
      isGameExistRepo
    )
  })

  it('should return the price history of a game', async () => {
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
      params: { id: 'id' }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).results[0]).toEqual(price.results[0])
    expect(response.statusCode).toBe(200)
  })

  it('should return NOT_FOUND if the game does not exist', async () => {
    jest.spyOn(isGameExistRepo, 'get').mockResolvedValueOnce(false)

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'invalid-id' }
    })

    expect(response.statusCode).toBe(404)
  })
})
