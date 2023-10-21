import { AxiosService } from '@infra/axios.service'
import { injectable } from 'tsyringe'

@injectable()
export class GreenManGamingGameDiscoveryScraper {
  constructor (private readonly axios: AxiosService) {}

  async discoverUrl (title: string): Promise<string | undefined> {
    const ruleContexts = ['BRL', 'BRL_BR', 'BR']
    const filters = 'IsSellable:true AND AvailableRegions:BR AND NOT ExcludeCountryCodes:BR AND IsDlc:false'
    const facetFilters = 'DrmName:Steam'

    const encodedTitle = encodeURIComponent(this.normalizeTitle(title))
    const requestBody = {
      requests: [
        {
          indexName: 'prod_ProductSearch_BR_IO',
          params: `query=${encodedTitle}&ruleContexts=${String(ruleContexts)}&filters=${filters}&facetFilters=${facetFilters}`
        }
      ]
    }
    const requestHeaders = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0',
      origin: 'https://www.greenmangaming.com'
    }

    const response = await this.axios.post<GmgResponse>(
      'https://sczizsp09z-3.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.5.1)%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.8.3)%3B%20JS%20Helper%20(3.2.2)&x-algolia-api-key=3bc4cebab2aa8cddab9e9a3cfad5aef3&x-algolia-application-id=SCZIZSP09Z',
      requestBody,
      {
        headers: requestHeaders
      }
    )

    const hits = response.results[0].hits

    for (const hit of hits) {
      const hitTitle = this.normalizeTitle(hit.DisplayName).toLowerCase()
      const steamTitle = this.normalizeTitle(title).toLowerCase()
      if (hitTitle === steamTitle) return `https://www.greenmangaming.com${hit.Url}`
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

interface GmgResponse {
  results: GmgHitList[]
}

interface GmgHitList {
  hits: GmgHit[]
}

interface GmgHit {
  DisplayName: string
  Url: string
}
