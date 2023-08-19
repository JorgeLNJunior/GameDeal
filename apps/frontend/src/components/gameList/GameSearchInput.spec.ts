import { wait } from '@packages/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import router from '@/router'

import GameSearchInput from './GameSearchInput.vue'

describe('GameSearchInput', () => {
  it.skip('should emit a search event with input value when user inputs', async () => {
    const event = 'search'
    const inputValue = 'Resident'

    const wrapper = mount(GameSearchInput, {
      global: { plugins: [router] }
    })

    await wrapper.get('[test-data="search-input"]').setValue(inputValue)

    await wait(900) // wait debounce function

    expect(wrapper.emitted()).toHaveProperty(event)
    expect(wrapper.emitted(event)?.at(0)?.at(0)).toBe(inputValue)
  })
})
