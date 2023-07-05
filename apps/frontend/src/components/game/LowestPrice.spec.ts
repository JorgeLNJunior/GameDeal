import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { Platform } from '@/types/Platform'

import LowestPrice from './LowestPrice.vue'

describe('LowestPrice', () => {
  it('Should render the platform', async () => {
    const platform = Platform.STEAM
    const price = 'R$ 75.20'
    const date = '10/05/2023'

    const wrapper = mount(LowestPrice, {
      props: { platform, price, date }
    })

    const value = wrapper.get('[test-data="platform"]').text()

    expect(value).toBe(`Plataforma: ${platform}`)
  })

  it('Should render the price', async () => {
    const platform = Platform.STEAM
    const price = 'R$ 75.20'
    const date = '10/05/2023'

    const wrapper = mount(LowestPrice, {
      props: { platform, price, date }
    })

    const value = wrapper.get('[test-data="price"]').text()

    expect(value).toBe(`Preço: ${price}`)
  })

  it('Should render the date', async () => {
    const platform = Platform.STEAM
    const price = 'R$ 75.20'
    const date = '10/05/2023'

    const wrapper = mount(LowestPrice, {
      props: { platform, price, date }
    })

    const value = wrapper.get('[test-data="date"]').text()

    expect(value).toBe(`Data: ${date}`)
  })
})
