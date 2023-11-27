import { GameBuilder, GamePriceBuilder } from '@packages/testing'
import type { GamePrice, LowestPrice, QueryData } from '@packages/types'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiService } from '@/api/api.service'
import router from '@/router'
import { HttpErrorType } from '@/types/httpError.type'

import { getAxiosError } from '../../testing/getAxiosError'
import GameView from './GameView.vue'

describe('GameView', () => {
  it('Should render the game title', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().build()
    const history = [price]
    const lowestPrice: LowestPrice = {
      steam: {
        price: 100.99,
        date: new Date().toString()
      },
      green_man_gaming: {
        price: 110.32,
        date: new Date().toString()
      },
      nuuvem: {
        price: 105.74,
        date: new Date().toString()
      }
    }

    const historyData: QueryData<GamePrice[]> = {
      results: history,
      count: 30,
      page: 1,
      totalPages: 3
    }

    const getGameSpy = vi
      .spyOn(ApiService.prototype, 'getGameByID')
      .mockResolvedValueOnce(game)
    const getPriceSpy = vi
      .spyOn(ApiService.prototype, 'getGamePrice')
      .mockResolvedValueOnce(price)
    const getLowestPriceSpy = vi
      .spyOn(ApiService.prototype, 'getLowestPrice')
      .mockResolvedValueOnce(lowestPrice)
    const getPriceHistorySpy = vi
      .spyOn(ApiService.prototype, 'getGamePriceHistory')
      .mockResolvedValueOnce(historyData)

    await router.replace(`/game/${game.id}`)

    const wrapper = mount(GameView, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(getGameSpy).toHaveBeenCalledOnce()
    expect(getGameSpy).toHaveBeenCalledWith(game.id)

    expect(getPriceSpy).toHaveBeenCalledOnce()
    expect(getPriceSpy).toHaveBeenCalledWith(game.id)

    expect(getLowestPriceSpy).toHaveBeenCalledOnce()
    expect(getLowestPriceSpy).toHaveBeenCalledWith(game.id)

    expect(getPriceHistorySpy).toHaveBeenCalledOnce()
    expect(getPriceHistorySpy).toHaveBeenCalledWith(game.id)

    const title = wrapper.get('[test-data="game-title"]').text()

    expect(title).toBe(game.title)
  })

  it('Should render a skeleton loader while the data is being retireved', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().build()
    const history = [price]
    const lowestPrice: LowestPrice = {
      steam: {
        price: 100.99,
        date: new Date().toString()
      },
      green_man_gaming: {
        price: 110.32,
        date: new Date().toString()
      },
      nuuvem: {
        price: 105.74,
        date: new Date().toString()
      }
    }

    const historyData: QueryData<GamePrice[]> = {
      results: history,
      count: 30,
      page: 1,
      totalPages: 3
    }

    vi.spyOn(ApiService.prototype, 'getGameByID').mockResolvedValueOnce(game)
    vi.spyOn(ApiService.prototype, 'getGamePrice').mockResolvedValueOnce(price)
    vi.spyOn(ApiService.prototype, 'getLowestPrice').mockResolvedValueOnce(lowestPrice)
    vi.spyOn(ApiService.prototype, 'getGamePriceHistory').mockResolvedValueOnce(historyData)

    const wrapper = mount(GameView, {
      global: {
        plugins: [router]
      }
    })

    let isSkeletonVisible = wrapper.find('[test-data="price-skeleton"]').exists()
    expect(isSkeletonVisible).toBe(true)

    await flushPromises()

    isSkeletonVisible = wrapper.find('[test-data="price-skeleton"]').exists()
    expect(isSkeletonVisible).toBe(false)
  })

  it('Should redirect to /notFound if jest has returned a 404 error', async () => {
    const routerSpy = vi.spyOn(router, 'push')

    vi.spyOn(ApiService.prototype, 'getGameByID').mockRejectedValueOnce(getAxiosError(404))

    await router.replace('/game/id')

    mount(GameView, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(routerSpy).toHaveBeenCalledOnce()
    expect(routerSpy).toHaveBeenCalledWith({
      path: '/error',
      query: { error: HttpErrorType.NOT_FOUND }
    })
  })
})
