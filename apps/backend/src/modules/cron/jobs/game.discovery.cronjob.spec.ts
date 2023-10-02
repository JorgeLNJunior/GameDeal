import { PinoLogger } from '@infra/pino.logger'
import { SteamGameDiscoveryScraper } from '@scrapers/discovery/steamGameDiscovery.scraper'
import { container } from 'tsyringe'

import { GameDiscoveryCronJob } from './game.discovery.cronjob'

describe('GameDiscoveryCronJob', () => {
  let job: GameDiscoveryCronJob
  let scraper: SteamGameDiscoveryScraper

  beforeEach(async () => {
    const logger = new PinoLogger()
    scraper = container.resolve(SteamGameDiscoveryScraper)
    job = new GameDiscoveryCronJob(scraper, logger)
  })

  it('should call the scraper', async () => {
    const spy = jest.spyOn(scraper, 'discoveryGames').mockResolvedValueOnce()

    await job.jobFunction()

    expect(spy).toHaveBeenCalled()
  })
})
