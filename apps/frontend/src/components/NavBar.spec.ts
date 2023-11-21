import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { GITHUB_URL, TELEGRAM_CHANNEL_URL } from '../constants/urls'
import NavBar from './NavBar.vue'

describe('NavBar', () => {
  it('should contain a button that redirects to the telegram channel', async () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
    const telegramButton = wrapper.get('[test-data="telegram_channel_btn"]')
    expect(telegramButton.attributes().href).toBe(TELEGRAM_CHANNEL_URL)
  })

  it('should contain a button that redirects to the github repository', async () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
    const githubButton = wrapper.get('[test-data="github_btn"]')
    expect(githubButton.attributes().href).toBe(GITHUB_URL)
  })
})
