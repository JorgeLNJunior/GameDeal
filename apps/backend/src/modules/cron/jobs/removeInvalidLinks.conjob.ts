import { AxiosService } from '@infra/axios.service'
import type { ApplicationCronJob } from '@localtypes/cron.type'
import { isAxiosError } from 'axios'
import { injectable } from 'tsyringe'

import { FindGMGURLsRepository } from './repositories/findGMGUrls.repository'
import { FindNuuvemURLsRepository } from './repositories/findNuuvemUrls.repository'
import { RemoveStoreURLRepository } from './repositories/removeStoreUrl.repository'

@injectable()
export class RemoveInvalidLinksCronJob implements ApplicationCronJob {
  public cronTime = '10 12 * * 0' // At UTC-3 12:10 on Sunday

  constructor (
    private readonly findNuuvemUrlsRepo: FindNuuvemURLsRepository,
    private readonly findGMGUrlsRepo: FindGMGURLsRepository,
    private readonly removeGameURLRepo: RemoveStoreURLRepository,
    private readonly axios: AxiosService
  ) { }

  async jobFunction (): Promise<void> {
    const nuuvemURLs = await this.findNuuvemUrlsRepo.find()

    for (const url of nuuvemURLs) {
      try {
        await this.axios.get(url.url)
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          await this.removeGameURLRepo.remove(url.game_id, true, false)
        }
      }
    }

    const gmgURLs = await this.findGMGUrlsRepo.find()

    for (const url of gmgURLs) {
      try {
        await this.axios.get(url.url)
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          await this.removeGameURLRepo.remove(url.game_id, false, true)
        }
      }
    }
  }
}
