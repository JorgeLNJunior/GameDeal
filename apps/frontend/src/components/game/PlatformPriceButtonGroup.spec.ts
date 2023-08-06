import { GameBuilder, GamePriceBuilder } from '@packages/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PlatformPriceButtonGroup from './PlatformPriceButtonGroup.vue'

describe('PlatformPriceButtonGroup', () => {
  it('should render a price card for each platform', async () => {
    const game = new GameBuilder().build()
    const currentPrice = new GamePriceBuilder().build()
    const wrapper = mount(PlatformPriceButtonGroup, {
      props: { game, currentPrice }
    })

    const steamCardExists = wrapper.find('[test-data="steam-card"]').exists()
    const nuuvemCardExists = wrapper.find('[test-data="nuuvem-card"]').exists()

    expect(steamCardExists).toBeDefined()
    expect(nuuvemCardExists).toBeDefined()
  })

  it('should not render a nuuvem price card if there is no nuuvem price', async () => {
    const game = new GameBuilder().build()
    const currentPrice = new GamePriceBuilder().withNuuvemPrice(null).build()
    const wrapper = mount(PlatformPriceButtonGroup, {
      props: { game, currentPrice }
    })

    const steamCardExists = wrapper.find('[test-data="steam-card"]').exists()
    const nuuvemCardExists = wrapper.find('[test-data="nuuvem-card"]').exists()

    expect(steamCardExists).toBe(true)
    expect(nuuvemCardExists).toBe(false)
  })
})
