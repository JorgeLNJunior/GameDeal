import type { Game, QueryData } from '@packages/types'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiService } from '@/api/api.service'
import router from '@/router'

import GameCount from './GameCount.vue'

describe('GameCount', () => {
  it('Should render the total games number', async () => {
    const count = 50
    const data: QueryData<Game[]> = {
      results: [],
      page: 1,
      totalPages: 5,
      count
    }

    const apiSpy = vi
      .spyOn(ApiService.prototype, 'getGames')
      .mockResolvedValueOnce(data)

    const wrapper = mount(GameCount, {
      global: {
        plugins: [router]
      }
    })

    expect(apiSpy).toHaveBeenCalledOnce()

    await flushPromises()

    const value = wrapper.get('[test-data="total"]').text()

    expect(Number(value)).toBe(count)
  })

  it('Should render a skeleton loader while the data is being retrieved', async () => {
    const count = 50
    const data: QueryData<Game[]> = {
      results: [],
      page: 1,
      totalPages: 5,
      count
    }

    vi.spyOn(ApiService.prototype, 'getGames').mockResolvedValueOnce(data)

    const wrapper = mount(GameCount, {
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
})
