import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NavBarLink from '@/components/NavBar/NavBarLink.vue'
import router from '@/router'

describe('NavBarLink', () => {
  it('should render the title', () => {
    const selector = '[data-testid=title]'
    const title = 'Home'
    const to = '/'

    const wrapper = mount(NavBarLink, { props: { title, to }, global: { plugins: [router] } })
    expect(wrapper.find(selector).text()).toBe(title)
  })

  // FIX: find out why the NavBarLink doesn't redirect while testing.
  it.skip('should redirect when clicked', async () => {
    const selector = '[data-testid=title]'
    const title = 'Deals'
    const to = '/deals'

    const wrapper = mount(NavBarLink, { props: { title, to }, global: { plugins: [router] } })

    expect(router.currentRoute.value.path).toBe('/')

    await wrapper.find(selector).trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe(to)
  })
})
