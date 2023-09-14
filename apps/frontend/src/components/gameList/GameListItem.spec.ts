import { GameBuilder, GamePriceBuilder } from '@packages/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiService } from '@/api/api.service'
import router from '@/router'

import GameListItem from './GameListItem.vue'

describe('GameListItem', () => {
  it('should render the title', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().build()

    const apiSpy = vi
      .spyOn(ApiService.prototype, 'getGamePrice')
      .mockResolvedValueOnce(price)

    const wrapper = mount(GameListItem, {
      props: { id: game.id, title: game.title },
      global: {
        plugins: [router]
      }
    })

    expect(apiSpy).toHaveBeenCalledOnce()
    expect(apiSpy).toHaveBeenCalledWith(game.id)

    await flushPromises()

    const result = wrapper.get('[test-data="title"]')

    expect(result.text()).toBe(game.title)
  })

  it('should parse and render the price as BRL currency format', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withSteamPrice(5.99).build()

    const apiSpy = vi
      .spyOn(ApiService.prototype, 'getGamePrice')
      .mockResolvedValueOnce(price)

    const wrapper = mount(GameListItem, {
      props: { id: game.id, title: game.title },
      global: {
        plugins: [router]
      }
    })

    expect(apiSpy).toHaveBeenCalledOnce()
    expect(apiSpy).toHaveBeenCalledWith(game.id)

    await flushPromises()

    const result = wrapper.get('[test-data="price"]')

    expect(result.text()).toBe('R$ 5,99')
  })

  it('should render a skeleton while the price is being retrieved', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().build()

    vi.spyOn(ApiService.prototype, 'getGamePrice').mockResolvedValueOnce(price)

    const wrapper = mount(GameListItem, {
      props: { id: game.id, title: game.title },
      global: {
        plugins: [router]
      }
    })

    let isSkeletonVisible = wrapper.find('[test-data="skeleton"]').exists()
    expect(isSkeletonVisible).toBe(true)

    await flushPromises()

    isSkeletonVisible = wrapper.find('[test-data="skeleton"]').exists()
    expect(isSkeletonVisible).toBe(false)
  })

  it('Should redirect to /error if something throws', async () => {
    const routerSpy = vi.spyOn(router, 'push').mockResolvedValueOnce()
    const game = new GameBuilder().build()

    vi.spyOn(ApiService.prototype, 'getGamePrice').mockRejectedValueOnce(new Error())

    mount(GameListItem, {
      props: { id: game.id, title: game.title },
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(routerSpy).toHaveBeenCalledOnce()
    expect(routerSpy).toHaveBeenCalledWith('/error')
  })
})
