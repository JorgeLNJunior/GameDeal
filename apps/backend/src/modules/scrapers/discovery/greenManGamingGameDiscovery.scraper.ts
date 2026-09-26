import { CuimpService } from '@infra/cuimp.service'
import { HttpService } from '@infra/http.service'
import { normalizeTitle } from '@scrapers/formaters/title.formater'
import { inject, injectable } from 'tsyringe'

@injectable()
export class GreenManGamingGameDiscoveryScraper {
  constructor(@inject(CuimpService) private readonly http: HttpService) { }

  async discoverUrl(title: string): Promise<string | undefined> {
    const ruleContexts = ['BRL', 'BRL_BR', 'BR']
    const filters = 'IsSellable:true AND AvailableRegions:BR AND NOT ExcludeCountryCodes:BR AND IsDlc:false'
    const facetFilters = 'DrmName:Steam'

    const encodedTitle = encodeURIComponent(normalizeTitle(title))
    const requestBody = {
      requests: [
        {
          indexName: 'prod_ProductSearch_BR_IO',
          params: `query=${encodedTitle}&ruleContexts=${String(ruleContexts)}&filters=${filters}&facetFilters=${facetFilters}`
        }
      ]
    }
    const requestHeaders = {
      origin: 'https://www.greenmangaming.com',
      refer: 'https://www.greenmangaming.com/'
    }

    const response = await this.http.post<GmgResponse>(
      encodeURI('https://sczizsp09z-1.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (4.5.1); Browser (lite); instantsearch.js (4.8.3); JS Helper (3.2.2)&x-algolia-api-key=5420d3ea58371da39dacf5a666ee94da&x-algolia-application-id=SCZIZSP09Z'),
      requestBody,
      {
        headers: requestHeaders
      }
    )

    const hits = response.results[0].hits

    for (const hit of hits) {
      const hitTitle = normalizeTitle(hit.DisplayName)
      const steamTitle = normalizeTitle(title)
      if (hitTitle === steamTitle) return `https://www.greenmangaming.com${hit.Url}`
    }
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
