import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import router from '@/router'

import InternalError from './InternalError.vue'

describe('InternalError', () => {
  describe('Redirect button', () => {
    it('should contain a redirect button', async () => {
      const wrapper = mount(InternalError, {
        global: {
          plugins: [router]
        }
      })
      const redirectButton = wrapper.get('[data-test="redirect"]')
      expect(redirectButton.text()).toBe('Voltar Para o Início')
    })

    it('should contain a redirect to /', async () => {
      const wrapper = mount(InternalError, {
        global: {
          plugins: [router]
        }
      })
      const redirectButton = wrapper.get('[data-test="redirect"]')
      expect(redirectButton.attributes().href).toBe('/')
    })
  })

  describe('Warn message', () => {
    it('should contain a warn message', async () => {
      const wrapper = mount(InternalError, {
        global: {
          plugins: [router]
        }
      })
      const messageElement = wrapper.get('[data-test="warn-message"]')
      expect(messageElement.text()).toBe('Ocorreu um erro inesperado.')
    })
  })
})
