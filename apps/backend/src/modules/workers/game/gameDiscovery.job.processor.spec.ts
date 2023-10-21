import { PinoLogger } from '@infra/pino.logger'
import { type GameDiscoveryScraperData, QueueJobName } from '@localtypes/queue.type'
import { GreenManGamingGameDiscoveryScraper } from '@scrapers/discovery/greenManGamingGameDiscovery.scraper'
import { NuuvemGameDiscoveryScraper } from '@scrapers/discovery/nuuvemGameDiscovery.scraper'
import { randomUUID } from 'crypto'
import { container } from 'tsyringe'

import { GameDiscoveryJobProcessor } from './gameDiscovery.job.processor'
import { UpdateGameUrlRepository } from './repositories/updateGameUrl.repository'

describe('GameDiscoveryJobProcessor', () => {
  let processor: GameDiscoveryJobProcessor
  let repository: UpdateGameUrlRepository
  let nuuvemDiscovery: NuuvemGameDiscoveryScraper
  let gmgDiscovery: GreenManGamingGameDiscoveryScraper

  beforeEach(async () => {
    repository = container.resolve(UpdateGameUrlRepository)
    nuuvemDiscovery = container.resolve(NuuvemGameDiscoveryScraper)
    gmgDiscovery = container.resolve(GreenManGamingGameDiscoveryScraper)
    processor = new GameDiscoveryJobProcessor(
      nuuvemDiscovery,
      gmgDiscovery,
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

  it('should discover the url of a green man gaming game', async () => {
    const url = 'https://www.greenmangaming.com/games/god-of-war-pc'
    const data: GameDiscoveryScraperData = {
      id: randomUUID(),
      title: 'God of War'
    }
    const repoSpy = jest.spyOn(repository, 'update').mockResolvedValueOnce()
    const gmgSpy = jest.spyOn(gmgDiscovery, 'discoverUrl')
      .mockResolvedValueOnce(url)

    await processor.findUrls(QueueJobName.GREEN_MAN_GAMING_GAME_DISCOVERY, data)

    expect(repoSpy).toHaveBeenCalled()
    expect(repoSpy).toHaveBeenCalledWith<[string, { green_man_gaming_url: string }]>(
      data.id,
      { green_man_gaming_url: url }
    )

    expect(gmgSpy).toHaveBeenCalled()
    expect(gmgSpy).toHaveBeenCalledWith<[string]>(data.title)
  })
})
