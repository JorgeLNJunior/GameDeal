import { GameBuilder, GamePriceDropBuilder } from '@packages/testing'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiService } from '@/api/api.service'

import PriceDropsListItem from './PriceDropsListItem.vue'

describe('PriceDropListItem', () => {
  beforeEach(() => vi.resetAllMocks())

  it('Should render the game title', async () => {
    const game = new GameBuilder().build()
    const drop = new GamePriceDropBuilder().withGame(game.id).build()

    const apiSpy = vi
      .spyOn(ApiService.prototype, 'getGameByID')
      .mockResolvedValueOnce(game)

    const wrapper = mount(PriceDropsListItem, {
      props: { drop },
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()

    expect(apiSpy).toHaveBeenCalledOnce()
    expect(apiSpy).toHaveBeenCalledWith(game.id)

    const title = wrapper.get('[test-data="title"]').text()

    expect(title).toBe(game.title)
  })

  it('Should render the price', async () => {
    const game = new GameBuilder().build()
    const drop = new GamePriceDropBuilder().withGame(game.id).build()
    const formatedPrice = `R$ ${drop.discount_price.toFixed(2).replace('.', ',')}`

    const apiSpy = vi
      .spyOn(ApiService.prototype, 'getGameByID')
      .mockResolvedValueOnce(game)

    const wrapper = mount(PriceDropsListItem, {
      props: { drop },
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()

    expect(apiSpy).toHaveBeenCalledOnce()
    expect(apiSpy).toHaveBeenCalledWith(game.id)

    const price = wrapper.get('[test-data="price"]').text()

    expect(price).toBe(formatedPrice)
  })

  it('Should render a skeleton while the data is being retrieved', async () => {
    const game = new GameBuilder().build()
    const drop = new GamePriceDropBuilder().withGame(game.id).build()

    vi.spyOn(ApiService.prototype, 'getGameByID').mockResolvedValueOnce(game)

    const wrapper = mount(PriceDropsListItem, {
      props: { drop },
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    let isSkeletonVisible = wrapper.find('[test-data="item-skeleton"]').exists()
    expect(isSkeletonVisible).toBe(true)

    await flushPromises()

    isSkeletonVisible = wrapper.find('[test-data="item-skeleton"]').exists()
    expect(isSkeletonVisible).toBe(false)
  })
})
