import { PinoLogger } from '@infra/pino.logger'
import { GamePriceQueue } from '@queue/gamePrice.queue'
import { container } from 'tsyringe'

import { GameScrapingCronJob } from './gameScraping.cronjob'
import { FindGameScraperDataRepository } from './repositories/findGameScraperData.repository'

describe('GameScrapingCronJob', () => {
  let job: GameScrapingCronJob
  let repository: FindGameScraperDataRepository
  let queue: GamePriceQueue

  beforeEach(async () => {
    repository = container.resolve(FindGameScraperDataRepository)
    queue = container.resolve(GamePriceQueue)
    job = new GameScrapingCronJob(repository, queue, new PinoLogger())
  })

  it('should add a list of games to the queue', async () => {
    const scraperData = [
      {
        id: 'id',
        steam_url: 'steam_url',
        nuuvem_url: 'nuuvem_url',
        green_man_gaming_url: 'green_man_gaming_url'
      },
      {
        id: 'id2',
        steam_url: 'steam_url2',
        nuuvem_url: 'nuuvem_url2',
        green_man_gaming_url: 'green_man_gaming_url2'
      },
      {
        id: 'id3',
        steam_url: 'steam_url3',
        nuuvem_url: 'nuuvem_url3',
        green_man_gaming_url: 'green_man_gaming_url3'
      }
    ]
    jest.spyOn(repository, 'find').mockResolvedValueOnce(scraperData)
    const queueSpy = jest.spyOn(queue, 'add').mockResolvedValue()

    await job.jobFunction()

    expect(queueSpy).toHaveBeenCalledTimes(scraperData.length)
  })
})
