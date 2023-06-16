import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import GameListItem from './GameListItem.vue'

describe('GameListItem', () => {
  it('should render the title', async () => {
    const game = {
      id: 'id',
      price: '150.99',
      title: 'God of War'
    }
    const wrapper = mount(GameListItem, {
      props: game,
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
    const title = wrapper.get('[test-data="title"]')

    expect(title.text()).toBe(game.title)
  })

  it('should parse and render the price as BRL currency format', async () => {
    const game = {
      id: 'id',
      price: '150.99',
      title: 'God of War'
    }
    const wrapper = mount(GameListItem, {
      props: game,
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
    const price = wrapper.get('[test-data="price"]')

    expect(price.text()).toBe('R$ 150,99')
  })
})
