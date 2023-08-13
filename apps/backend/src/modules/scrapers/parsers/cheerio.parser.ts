import type { HTMLParser } from '@localtypes/html.parser'
import * as cheerio from 'cheerio'

export class CheerioParser implements HTMLParser {
  getSelectorValue (
    html: string,
    selector: string,
    removeSelectors?: string[]
  ): string | undefined {
    const wrapper = cheerio.load(html)

    removeSelectors?.forEach((selector) => {
      wrapper(selector).remove()
    })

    const value = wrapper(selector)
    if (value.html() === null) return undefined

    return value.text().trim()
  }
}
