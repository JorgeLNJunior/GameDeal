import { GameBuilder, GamePriceDropBuilder } from '@packages/testing'
import type { GamePriceDrop, QueryData } from '@packages/types'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiService } from '@/api/api.service'
import router from '@/router'

import PriceDropsList from './PriceDropsList.vue'

describe('PriceDropsList', () => {
  afterEach(() => { vi.clearAllMocks() })

  it('should render a list of price drops', async () => {
    const game = new GameBuilder().build()
    const drops: GamePriceDrop[] = [
      new GamePriceDropBuilder().withGame(game.id).build(),
      new GamePriceDropBuilder().withGame(game.id).build(),
      new GamePriceDropBuilder().withGame(game.id).build()
    ]
    const data: QueryData<GamePriceDrop[]> = {
      results: drops,
      count: 30,
      page: 1,
      totalPages: 3
    }

    const apiSpy = vi
      .spyOn(ApiService.prototype, 'getTodayPriceDrops')
      .mockResolvedValueOnce(data)
    vi.spyOn(ApiService.prototype, 'getGameByID').mockResolvedValue(game)

    const wrapper = mount(PriceDropsList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(apiSpy).toHaveBeenCalledOnce()

    const children = wrapper.get('[test-data="items"]').findAll('li')

    expect(children.length).toBe(drops.length)
  })

  it('should render a skeleton while the data is being retrieved', async () => {
    const game = new GameBuilder().build()
    const drops: GamePriceDrop[] = [
      new GamePriceDropBuilder().withGame(game.id).build()
    ]
    const data: QueryData<GamePriceDrop[]> = {
      results: drops,
      count: 30,
      page: 1,
      totalPages: 3
    }

    vi.spyOn(ApiService.prototype, 'getTodayPriceDrops').mockResolvedValueOnce(data)
    vi.spyOn(ApiService.prototype, 'getGameByID').mockResolvedValue(game)

    const wrapper = mount(PriceDropsList, {
      global: {
        plugins: [router]
      }
    })

    let isSkeletonVisible = wrapper.find('[test-data="list-skeleton"]').exists()
    expect(isSkeletonVisible).toBe(true)

    await flushPromises()

    isSkeletonVisible = wrapper.find('[test-data="list-skeleton"]').exists()
    expect(isSkeletonVisible).toBe(false)
  })

  it('should render a message if there is no price drop', async () => {
    const game = new GameBuilder().build()
    const drops: GamePriceDrop[] = []
    const data: QueryData<GamePriceDrop[]> = {
      results: drops,
      count: 0,
      page: 1,
      totalPages: 1
    }

    vi.spyOn(ApiService.prototype, 'getTodayPriceDrops').mockResolvedValueOnce(data)
    vi.spyOn(ApiService.prototype, 'getGameByID').mockResolvedValue(game)

    const wrapper = mount(PriceDropsList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    const message = wrapper.find('[test-data="no-drops-msg"]')

    expect(message.text()).toBe('Não há nada por aqui hoje')
  })
})
