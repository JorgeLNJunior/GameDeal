import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { GREEN_MAN_GAMING_URL, NUUVEM_URL, STEAM_URL } from '@/constants/urls'

import StoreNameButton from './StoreNameButton.vue'

describe('StoreNameButton', () => {
  describe('Store URL', () => {
    it('Should contain the steam url if it receives STEAM as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Steam' }
      })

      const url = wrapper.get('[test-data="button"]').attributes().href

      expect(url).toBe(STEAM_URL)
    })

    it('Should contain the nuuvem url if it receives NUUVEM as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Nuuvem' }
      })

      const url = wrapper.get('[test-data="button"]').attributes().href

      expect(url).toBe(NUUVEM_URL)
    })

    it('Should contain the green man gaming url if it receives GREEN_MAN_GAMING as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Green Man Gaming' }
      })

      const url = wrapper.get('[test-data="button"]').attributes().href

      expect(url).toBe(GREEN_MAN_GAMING_URL)
    })
  })

  describe('Store name', () => {
    it('Should render "Steam" if it receives STEAM as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Steam' }
      })

      const name = wrapper.get('[test-data="name"]').text()

      expect(name).toBe('Steam')
    })

    it('Should render "Nuuvem" if it receives NUUVEM as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Nuuvem' }
      })

      const name = wrapper.get('[test-data="name"]').text()

      expect(name).toBe('Nuuvem')
    })

    it('Should render "Green Man Gaming" if it receives GREEN_MAN_GAMING as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Green Man Gaming' }
      })

      const name = wrapper.get('[test-data="name"]').text()

      expect(name).toBe('Green Man Gaming')
    })
  })

  describe('Store icon', () => {
    it('Should render the steam icon if it receives STEAM as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Steam' }
      })

      const steamIconExists = wrapper.find('[test-data="steam-icon"]').exists()
      const nuuvemIconExists = wrapper.find('[test-data="nuuvem-icon"]').exists()
      const gmgIconExists = wrapper.find('[test-data="gmg-icon"]').exists()

      expect(steamIconExists).toBe(true)
      expect(nuuvemIconExists).toBe(false)
      expect(gmgIconExists).toBe(false)
    })

    it('Should render the nuuvem icon if it receives NUUVEM as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Nuuvem' }
      })

      const steamIconExists = wrapper.find('[test-data="steam-icon"]').exists()
      const nuuvemIconExists = wrapper.find('[test-data="nuuvem-icon"]').exists()
      const gmgIconExists = wrapper.find('[test-data="gmg-icon"]').exists()

      expect(steamIconExists).toBe(false)
      expect(nuuvemIconExists).toBe(true)
      expect(gmgIconExists).toBe(false)
    })

    it('Should render the Green Man Gaming icon if it receives GREEN_MAN_GAMING as store', async () => {
      const wrapper = mount(StoreNameButton, {
        props: { store: 'Green Man Gaming' }
      })

      const steamIconExists = wrapper.find('[test-data="steam-icon"]').exists()
      const nuuvemIconExists = wrapper.find('[test-data="nuuvem-icon"]').exists()
      const gmgIconExists = wrapper.find('[test-data="gmg-icon"]').exists()

      expect(steamIconExists).toBe(false)
      expect(nuuvemIconExists).toBe(false)
      expect(gmgIconExists).toBe(true)
    })
  })
})
