import { GameBuilder } from '@packages/testing'
import type { Game, QueryData } from '@packages/types'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiService } from '@/api/api.service'
import router from '@/router'

import GameList from './GameList.vue'

describe('GameList', () => {
  describe('Game list', () => {
    it('Should render a list of games', async () => {
      const games = [
        new GameBuilder().build(),
        new GameBuilder().build(),
        new GameBuilder().build()
      ]
      const data: QueryData<Game[]> = {
        results: games,
        count: 30,
        page: 1,
        totalPages: 3
      }

      const apiSpy = vi
        .spyOn(ApiService.prototype, 'getGames')
        .mockResolvedValueOnce(data)

      const wrapper = mount(GameList, {
        global: {
          plugins: [router]
        }
      })

      expect(apiSpy).toHaveBeenCalledOnce()

      await flushPromises()

      const children = wrapper.get('[test-data="game-list"]').findAll('li')

      expect(children.length).toBe(games.length)
    })

    it('Should render a skeleton loader while the data is being retireved', async () => {
      const games = [
        new GameBuilder().build(),
        new GameBuilder().build(),
        new GameBuilder().build()
      ]
      const data: QueryData<Game[]> = {
        results: games,
        count: 30,
        page: 1,
        totalPages: 3
      }

      vi.spyOn(ApiService.prototype, 'getGames').mockResolvedValueOnce(data)

      const wrapper = mount(GameList, {
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
  })

  describe('Pagination button', () => {
    it('Should render a pagination button', async () => {
      const games = [new GameBuilder().build()]
      const data: QueryData<Game[]> = {
        results: games,
        count: 30,
        page: 1,
        totalPages: 3
      }

      vi.spyOn(ApiService.prototype, 'getGames').mockResolvedValueOnce(data)

      const wrapper = mount(GameList, {
        global: {
          plugins: [router]
        }
      })

      await flushPromises()

      const isButtonVisible = wrapper.find('[test-data="pagination-button"]').exists()

      expect(isButtonVisible).toBe(true)
    })

    it('Should render a skeleton loader while the data is being retireved', async () => {
      const games = [
        new GameBuilder().build(),
        new GameBuilder().build(),
        new GameBuilder().build()
      ]
      const data: QueryData<Game[]> = {
        results: games,
        count: 30,
        page: 1,
        totalPages: 3
      }

      vi.spyOn(ApiService.prototype, 'getGames').mockResolvedValueOnce(data)

      const wrapper = mount(GameList, {
        global: {
          plugins: [router]
        }
      })

      let isSkeletonVisible = wrapper.find('[test-data="pagination-skeleton"]').exists()
      expect(isSkeletonVisible).toBe(true)

      await flushPromises()

      isSkeletonVisible = wrapper.find('[test-data="pagination-skeleton"]').exists()
      expect(isSkeletonVisible).toBe(false)
    })
  })
})
