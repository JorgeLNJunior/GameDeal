import { container } from 'tsyringe'

import { IsGameExistRepository } from '../getGamePriceHistory/repositories/isGameExist.repository'
import { GetLowestHistoricalPriceController } from './getLowestHistoricalPrice.controller'
import { GetLowestHistoricalPriceRepository } from './repositories/getLowestHistoricalPrice.repository'

describe('GetLowestHistoricalPriceController', () => {
  let controller: GetLowestHistoricalPriceController
  let getLowestHistoricalPriceRepo: GetLowestHistoricalPriceRepository
  let isGameExistRepo: IsGameExistRepository

  beforeEach(async () => {
    getLowestHistoricalPriceRepo = container.resolve(
      GetLowestHistoricalPriceRepository
    )
    isGameExistRepo = container.resolve(IsGameExistRepository)
    controller = new GetLowestHistoricalPriceController(
      getLowestHistoricalPriceRepo,
      isGameExistRepo
    )
  })

  it('should return a price', async () => {
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
      params: { id: 'id' }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(response.body).toEqual(price)
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
