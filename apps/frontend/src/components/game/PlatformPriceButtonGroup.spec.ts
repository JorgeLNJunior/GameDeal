import { GameBuilder, GamePriceBuilder } from '@packages/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PlatformPriceButtonGroup from './PlatformPriceButtonGroup.vue'

describe('PlatformPriceButtonGroup', () => {
  it('should render a price button for each platform', async () => {
    const game = new GameBuilder().build()
    const currentPrice = new GamePriceBuilder().build()
    const wrapper = mount(PlatformPriceButtonGroup, {
      props: { game, currentPrice }
    })

    const steamButtonExists = wrapper.find('[test-data="steam-button"]').exists()
    const nuuvemButtonExists = wrapper.find('[test-data="nuuvem-button"]').exists()
    const gmgButtonExists = wrapper.find('[test-data="gmg-button"]').exists()

    expect(steamButtonExists).toBeDefined()
    expect(nuuvemButtonExists).toBeDefined()
    expect(gmgButtonExists).toBeDefined()
  })

  it('should not render a nuuvem price button if there is no nuuvem price', async () => {
    const game = new GameBuilder().build()
    const currentPrice = new GamePriceBuilder().withNuuvemPrice(null).build()
    const wrapper = mount(PlatformPriceButtonGroup, {
      props: { game, currentPrice }
    })

    const steamButtonExists = wrapper.find('[test-data="steam-button"]').exists()
    const nuuvemButtonExists = wrapper.find('[test-data="nuuvem-button"]').exists()

    expect(steamButtonExists).toBe(true)
    expect(nuuvemButtonExists).toBe(false)
  })

  it('should not render a green man gaming price button if there is no green man gaming price', async () => {
    const game = new GameBuilder().build()
    const currentPrice = new GamePriceBuilder().withGreenManGamingPrice(null).build()
    const wrapper = mount(PlatformPriceButtonGroup, {
      props: { game, currentPrice }
    })

    const steamButtonExists = wrapper.find('[test-data="steam-button"]').exists()
    const gmgButtonExists = wrapper.find('[test-data="gmg-button"]').exists()

    expect(steamButtonExists).toBe(true)
    expect(gmgButtonExists).toBe(false)
  })
})
