import { type Store } from '@packages/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import StorePriceButton from './StorePriceButton.vue'

describe('StorePriceButton', () => {
  it('should render the price', async () => {
    const url = 'https://google.com'
    const store: Store = 'Steam'
    const price = '30.15'
    const priceWithCurrency = 'R$ 30,15'

    const wrapper = mount(StorePriceButton, {
      props: { url, store, price }
    })

    const value = wrapper.get('[test-data="price"]').text()

    expect(value).toBe(priceWithCurrency)
  })

  it('should render a steam icon if it receives steam as store', async () => {
    const url = 'https://google.com'
    const store = 'Steam'
    const price = '30.15'

    const wrapper = mount(StorePriceButton, {
      props: { url, store, price }
    })

    const icon = wrapper.get('[test-data="steam-icon"]')

    expect(icon).toBeDefined()
  })

  it('should render a nuuvem icon if it receives nuuvem as store', async () => {
    const url = 'https://google.com'
    const store: Store = 'Nuuvem'
    const price = '30.15'

    const wrapper = mount(StorePriceButton, {
      props: { url, store, price }
    })

    const icon = wrapper.get('[test-data="nuuvem-icon"]')

    expect(icon).toBeDefined()
  })

  it('should render a green man gaming icon if it receives green man gaming as store', async () => {
    const url = 'https://google.com'
    const store: Store = 'Green Man Gaming'
    const price = '30.15'

    const wrapper = mount(StorePriceButton, {
      props: { url, store, price }
    })

    const icon = wrapper.get('[test-data="gmg-icon"]')

    expect(icon).toBeDefined()
  })
})
