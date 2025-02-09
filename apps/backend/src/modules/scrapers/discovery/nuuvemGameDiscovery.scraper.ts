import { AxiosService } from '@infra/axios.service'
import * as cheerio from 'cheerio'
import { injectable } from 'tsyringe'

@injectable()
export class NuuvemGameDiscoveryScraper {
  constructor (private readonly axios: AxiosService) { }

  async discoverUrl (title: string): Promise<string | undefined> {
    const normalizedTitle = this.normalizeTitle(title)
    const body = await this.axios.get<string>(
      `https://www.nuuvem.com/br-en/catalog/drm/steam/platforms/pc/page/1/search/${normalizedTitle}`
    )

    const wrapper = cheerio.load(body)
    const data = wrapper('div.products-items > div.grid > div > a').toArray()

    for (const element of data) {
      const nuuvemTitle = this.normalizeTitle(element.attribs.title).toLowerCase()
      const steamTitle = normalizedTitle.toLocaleLowerCase()

      if (nuuvemTitle === steamTitle) {
        return element.attribs.href
      }
    }
  }

  private normalizeTitle (title: string): string {
    return title.replaceAll('™', '')
      .replaceAll('®', '')
      .replaceAll('.', ' ')
      .replaceAll('/', '')
      .replaceAll(':', '')
      .replaceAll('-', '')
      .replaceAll('!', '')
      .replaceAll('%', '')
  }
}
