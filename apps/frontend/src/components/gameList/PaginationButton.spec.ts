import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import router from '@/router'

import PaginationButton from './PaginationButton.vue'

describe('PaginationButton', () => {
  describe('Pages text', () => {
    it('should render current and total pages value', async () => {
      const currentPage = 5
      const totalPages = 20
      const wrapper = mount(PaginationButton, {
        props: { currentPage, totalPages },
        global: {
          plugins: [router]
        }
      })

      const value = wrapper.get('[test-data="pages"]').text()

      expect(value).toBe(`${currentPage} / ${totalPages}`)
    })
  })

  describe('Previous button', () => {
    it('should be disabled if it is at first page', async () => {
      const currentPage = 1
      const totalPages = 20
      const wrapper = mount(PaginationButton, {
        props: { currentPage, totalPages },
        global: {
          plugins: [router]
        }
      })

      const isDisabled = wrapper.get('[test-data="previous-button"]')
        .attributes().disabled

      expect(isDisabled).toBeDefined()
    })

    it('should not be disabled if it is not at first page', async () => {
      const currentPage = 10
      const totalPages = 20
      const wrapper = mount(PaginationButton, {
        props: { currentPage, totalPages },
        global: {
          plugins: [router]
        }
      })

      const isDisabled = wrapper.get('[test-data="previous-button"]')
        .attributes().disabled

      expect(isDisabled).toBeUndefined()
    })

    it('should redirect to the previous page if the button is pressed', async () => {
      const currentPage = 10
      const totalPages = 20
      const wrapper = mount(PaginationButton, {
        props: { currentPage, totalPages },
        global: {
          plugins: [router]
        }
      })

      const routerSpy = vi.spyOn(router, 'push').mockResolvedValueOnce()

      await wrapper.get('[test-data="previous-button"]').trigger('click')

      expect(routerSpy).toHaveBeenCalled()
    })
  })

  describe('Next button', () => {
    it('should be disabled if it is at last page', async () => {
      const totalPages = 20
      const currentPage = totalPages
      const wrapper = mount(PaginationButton, {
        props: { currentPage, totalPages },
        global: {
          plugins: [router]
        }
      })

      const isDisabled = wrapper.get('[test-data="next-button"]')
        .attributes().disabled

      expect(isDisabled).toBeDefined()
    })

    it('should not be disabled if it is not at last page', async () => {
      const currentPage = 10
      const totalPages = 20
      const wrapper = mount(PaginationButton, {
        props: { currentPage, totalPages },
        global: {
          plugins: [router]
        }
      })

      const isDisabled = wrapper.get('[test-data="next-button"]')
        .attributes().disabled

      expect(isDisabled).toBeUndefined()
    })

    it('should redirect to the next page if the button is pressed', async () => {
      const currentPage = 10
      const totalPages = 20
      const wrapper = mount(PaginationButton, {
        props: { currentPage, totalPages },
        global: {
          plugins: [router]
        }
      })

      const routerSpy = vi.spyOn(router, 'push').mockResolvedValueOnce()

      await wrapper.get('[test-data="next-button"]').trigger('click')

      expect(routerSpy).toHaveBeenCalled()
    })
  })
})
