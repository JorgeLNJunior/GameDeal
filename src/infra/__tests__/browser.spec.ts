import 'reflect-metadata'

import { Browser } from '../browser'

describe('Browser', () => {
  let browser: Browser

  beforeEach(async () => {
    browser = new Browser()
  })

  describe('launch', () => {
    it('should launch a new browser instance', async () => {
      await expect(browser.launch()).resolves.not.toThrow()
      await browser.close()
    })
  })

  describe('close', () => {
    it('should close a browser instance', async () => {
      await browser.launch()
      await expect(browser.close()).resolves.not.toThrow()
    })
  })

  describe('getPage', () => {
    it('should return a new page', async () => {
      await browser.launch()
      const page = await browser.getPage()

      expect(page).toBeDefined()

      await browser.close()
    })
  })
})
