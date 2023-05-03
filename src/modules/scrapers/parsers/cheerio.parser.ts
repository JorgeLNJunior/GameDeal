import { HTMLParser } from '@localtypes/html.parser'
import * as cheerio from 'cheerio'

export class CheerioParser implements HTMLParser {
  getElementValue(
    content: string,
    element: string,
    removeElements?: string[]
  ): string | undefined {
    const selector = cheerio.load(content)

    removeElements?.forEach((element) => {
      selector(element).remove()
    })

    const value = selector(element)
    if (!value.html()) return undefined

    console.log(value.text())

    return value.text().trim()
  }
}
