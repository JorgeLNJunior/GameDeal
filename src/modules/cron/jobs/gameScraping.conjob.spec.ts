import { PinoLogger } from '@infra/pino.logger'
import { GameQueue } from '@queue/game.queue'
import { container } from 'tsyringe'

import { GameScrapingCronJob } from './gameScraping.cronjob'
import { FindGameScraperDataRepository } from './repositories/findGameScraperData.repository'

describe('GameScrapingCronJob', () => {
  let job: GameScrapingCronJob
  let repository: FindGameScraperDataRepository
  let queue: GameQueue

  beforeEach(async () => {
    repository = container.resolve(FindGameScraperDataRepository)
    queue = container.resolve(GameQueue)
    job = new GameScrapingCronJob(repository, queue, new PinoLogger())
  })

  it('should add a list of games to the queue', async () => {
    const scraperData = [
      { id: 'id', steam_url: 'steam_url', nuuvem_url: 'nuuvem_url' },
      { id: 'id2', steam_url: 'steam_url2', nuuvem_url: 'nuuvem_url2' },
      { id: 'id3', steam_url: 'steam_url3', nuuvem_url: 'nuuvem_url3' }
    ]
    jest.spyOn(repository, 'find').mockResolvedValueOnce(scraperData)
    const queueSpy = jest.spyOn(queue, 'add').mockResolvedValue()

    await job.jobFunction()

    expect(queueSpy).toHaveBeenCalledTimes(scraperData.length)
  })
})
