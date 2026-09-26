import { CuimpService } from '@infra/cuimp.service'
import { HttpService } from '@infra/http.service'
import { normalizeTitle } from '@scrapers/formaters/title.formater'
import * as cheerio from 'cheerio'
import { inject, injectable } from 'tsyringe'

@injectable()
export class NuuvemGameDiscoveryScraper {
  constructor(@inject(CuimpService) private readonly http: HttpService) { }

  async discoverUrl(title: string): Promise<string | undefined> {
    const encodedTitle = encodeURIComponent(normalizeTitle(title))
    const body = await this.http.get<string>(
      `https://www.nuuvem.com/br-en/catalog/drm/steam/platforms/pc/page/1/search/${encodedTitle}`
    )

    const wrapper = cheerio.load(body)
    const data = wrapper('div.products-items > div.nvm-grid > div > a').toArray()

    for (const element of data) {
      const nuuvemTitle = normalizeTitle(element.attribs.title)
      const steamTitle = normalizeTitle(title)

      if (nuuvemTitle === steamTitle) {
        return element.attribs.href
      }
    }
  }
}
