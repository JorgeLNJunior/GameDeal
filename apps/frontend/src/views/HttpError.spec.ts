import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import router from '@/router'
import { HttpErrorType } from '@/types/httpError.type'

import HttpError from './HttpError.vue'

describe.skip('HttpError', () => {
  describe('Redirect button', () => {
    it('should contain a redirect button', async () => {
      const wrapper = mount(HttpError, {
        global: {
          plugins: [router]
        }
      })
      const redirectButton = wrapper.get('[data-test="redirect"]')
      expect(redirectButton.text()).toBe('Voltar Para o Início')
    })

    it('should contain a redirect to /', async () => {
      const wrapper = mount(HttpError, {
        global: {
          plugins: [router]
        }
      })
      const redirectButton = wrapper.get('[data-test="redirect"]')
      expect(redirectButton.attributes().href).toBe('/')
    })
  })

  describe('Status', () => {
    it('should contain a the status code 404', async () => {
      const wrapper = mount(HttpError, {
        global: {
          plugins: [router]
        }
      })
      await router.replace({ query: { error: HttpErrorType.NOT_FOUND } })

      const status = wrapper.get('[data-test="status"]')
      expect(status.text()).toBe('404')
    })

    it('should contain a the status code 429', async () => {
      const wrapper = mount(HttpError, {
        global: {
          plugins: [router]
        }
      })
      await router.replace({ query: { error: HttpErrorType.TOO_MANY_REQUESTS } })

      const status = wrapper.get('[data-test="status"]')
      expect(status.text()).toBe('429')
    })

    it('should contain a the status code 500', async () => {
      const wrapper = mount(HttpError, {
        global: {
          plugins: [router]
        }
      })
      await router.replace({ query: { error: HttpErrorType.INTERNAL } })

      const status = wrapper.get('[data-test="status"]')
      expect(status.text()).toBe('500')
    })

    it('should contain a warn message', async () => {
      const wrapper = mount(HttpError, {
        global: {
          plugins: [router]
        }
      })
      const messageElement = wrapper.get('[data-test="warn-message"]')
      expect(messageElement.text()).toBeDefined()
    })
  })
})
