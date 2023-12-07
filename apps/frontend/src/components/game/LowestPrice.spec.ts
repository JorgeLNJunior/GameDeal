import { Store } from '@packages/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import LowestPrice from './LowestPrice.vue'

describe('LowestPrice', () => {
  it('Should render the store', async () => {
    const store = Store.STEAM
    const price = 'R$ 75.20'
    const date = '10/05/2023'

    const wrapper = mount(LowestPrice, {
      props: { store, price, date }
    })

    const value = wrapper.get('[test-data="store"]').text()

    expect(value).toContain(store)
  })

  it('Should render the price', async () => {
    const store = Store.STEAM
    const price = 'R$ 75.20'
    const date = '10/05/2023'

    const wrapper = mount(LowestPrice, {
      props: { store, price, date }
    })

    const value = wrapper.get('[test-data="price"]').text()

    expect(value).toContain(price)
  })

  it('Should render the date', async () => {
    const store = Store.STEAM
    const price = 'R$ 75.20'
    const date = '10/05/2023'

    const wrapper = mount(LowestPrice, {
      props: { store, price, date }
    })

    const value = wrapper.get('[test-data="date"]').text()

    expect(value).toContain(date)
  })
})
