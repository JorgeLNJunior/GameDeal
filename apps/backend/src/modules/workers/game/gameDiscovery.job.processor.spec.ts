import { PinoLogger } from '@infra/pino.logger'
import { type GameDiscoveryScraperData, QueueJobName } from '@localtypes/queue.type'
import { NuuvemGameDiscoveryScraper } from '@scrapers/discovery/nuuvemGameDiscovery.scraper'
import { randomUUID } from 'crypto'
import { container } from 'tsyringe'

import { GameDiscoveryJobProcessor } from './gameDiscovery.job.processor'
import { UpdateGameUrlRepository } from './repositories/updateGameUrl.repository'

describe('GameDiscoveryJobProcessor', () => {
  let processor: GameDiscoveryJobProcessor
  let repository: UpdateGameUrlRepository
  let nuuvemDiscovery: NuuvemGameDiscoveryScraper

  beforeEach(async () => {
    repository = container.resolve(UpdateGameUrlRepository)
    nuuvemDiscovery = container.resolve(NuuvemGameDiscoveryScraper)
    processor = new GameDiscoveryJobProcessor(
      nuuvemDiscovery,
      repository,
      new PinoLogger()
    )
  })

  it('should discover the url of a nuuvem game', async () => {
    const url = 'https://www.nuuvem.com/br-en/item/god-of-war'
    const data: GameDiscoveryScraperData = {
      id: randomUUID(),
      title: 'God of War'
    }
    const repoSpy = jest.spyOn(repository, 'update').mockResolvedValueOnce()
    const nuuvemSpy = jest.spyOn(nuuvemDiscovery, 'discoverUrl')
      .mockResolvedValueOnce(url)

    await processor.findUrls(QueueJobName.NUUVEM_GAME_DISCOVERY, data)

    expect(repoSpy).toHaveBeenCalled()
    expect(repoSpy).toHaveBeenCalledWith<[string, { nuuvem_url: string }]>(
      data.id,
      { nuuvem_url: url }
    )

    expect(nuuvemSpy).toHaveBeenCalled()
    expect(nuuvemSpy).toHaveBeenCalledWith<[string]>(data.title)
  })
})
