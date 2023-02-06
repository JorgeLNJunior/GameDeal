import Playwright from 'playwright'
import { singleton } from 'tsyringe'

import { Logger } from './logger'

@singleton()
export class Browser {
  private playwright!: Playwright.Browser

  constructor(private logger: Logger) {}

  /**
   * Launch a new browser instance.
   *
   * ```
   * await browser.launch()
   * ```
   */
  async launch(): Promise<void> {
    this.logger.info('[browser] launching browser')
    this.playwright = await Playwright.chromium.launch()
    this.logger.info('[browser] browser launched')
  }

  /**
   * Close the browser instance and all its pages.
   *
   * ```
   * await browser.close()
   * ```
   */
  async close(): Promise<void> {
    this.logger.info('[browser] closing browser')
    await this.playwright.close()
    this.logger.info('[browser] browser closed')
  }

  /**
   * Create a new page with its own context.
   * A browser instance should be launched before.
   *
   * ```
   * await browser.launch()
   * const page = await browser.newPage()
   * ```
   *
   * @returns {Playwright.Page} The page instance.
   */
  async getPage(): Promise<Playwright.Page> {
    const ctx = await this.playwright.newContext()
    await ctx.addCookies([
      {
        name: 'birthtime',
        value: '0',
        domain: '.steampowered.com',
        path: '/'
      }
    ])
    return ctx.newPage()
  }
}
