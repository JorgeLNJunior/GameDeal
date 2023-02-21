import Playwright from 'playwright'
import { inject, singleton } from 'tsyringe'

import { PINO_LOGGER } from '../dependencies/dependency.tokens'
import { ApplicationLogger } from '../types/logger.type'

@singleton()
export class Browser {
  private playwright!: Playwright.Browser

  /**
   * A browser wraper.
   *
   * @param logger - An instance of `ApplicationLogger`.
   */
  constructor(@inject(PINO_LOGGER) private logger: ApplicationLogger) {}

  /**
   * Launches a new browser instance.
   *
   * @example
   * ```
   * await browser.launch()
   * ```
   */
  async launch(): Promise<void> {
    this.logger.info('[Browser] launching browser')
    this.playwright = await Playwright.chromium.launch()
    this.logger.info('[Browser] browser launched')
  }

  /**
   * Closes the browser instance and all its pages.
   *
   * @example
   * ```
   * await browser.close()
   * ```
   */
  async close(): Promise<void> {
    this.logger.info('[Browser] closing browser')
    await this.playwright.close()
    this.logger.info('[Browser] browser closed')
  }

  /**
   * Creates a new page with its own context.
   * A browser instance should be launched before.
   *
   * @example
   * ```
   * await browser.launch()
   * const page = await browser.newPage()
   * // do something with the page
   * await page.close()
   * ```
   * @returns The page instance.
   */
  async getPage(): Promise<Playwright.Page> {
    const ctx = await this.playwright.newContext()

    // bypass steam age check
    await ctx.addCookies([
      {
        name: 'birthtime',
        value: '0',
        domain: '.steampowered.com',
        path: '/'
      }
    ])

    // block unnecessary resources
    ctx.route('**/*', async (route) => {
      const resourcesToBlock = ['stylesheet', 'image', 'font', 'media', 'other']

      if (resourcesToBlock.includes(route.request().resourceType())) {
        return route.abort()
      }
      return route.continue()
    })

    return ctx.newPage()
  }
}
