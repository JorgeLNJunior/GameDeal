import Playwright from 'playwright'
import { singleton } from 'tsyringe'

@singleton()
export class Browser {
  private playwright!: Playwright.Browser

  /**
   * Launch a new browser instance.
   *
   * ```
   * await browser.launch()
   * ```
   */
  async launch(): Promise<void> {
    this.playwright = await Playwright.chromium.launch()
  }

  /**
   * Close the browser instance and all its pages.
   *
   * ```
   * await browser.close()
   * ```
   */
  async close(): Promise<void> {
    return this.playwright.close()
  }

  /**
   * Create a new page with its own context.
   *
   * @returns {Playwright.Page} The page instance.
   */
  async getPage(): Promise<Playwright.Page> {
    const ctx = await this.playwright.newContext()
    ctx.addCookies([
      {
        name: 'birthtime',
        value: '0',
        domain: 'store.steampowered.com',
        path: '/',
        secure: false,
        httpOnly: false,
        expires: 86400,
        sameSite: 'None'
      }
    ])
    return ctx.newPage()
  }
}
