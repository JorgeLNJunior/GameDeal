import { DatabaseService } from '@database/database.service'
import { PinoLogger } from '@infra/pino.logger'
import { type GameDiscoveryScraperData, QueueJobName } from '@localtypes/queue.type'
import { GameBuilder } from '@packages/testing'
import { GameDiscoveryQueue } from '@queue/gameDiscovery.queue'
import { SteamGameDiscoveryScraper } from '@scrapers/discovery/steamGameDiscovery.scraper'
import { container } from 'tsyringe'

import { GameDiscoveryCronJob } from './game.discovery.cronjob'

describe('GameDiscoveryCronJob', () => {
  let job: GameDiscoveryCronJob
  let queue: GameDiscoveryQueue
  let steamDiscovery: SteamGameDiscoveryScraper
  let db: DatabaseService

  beforeEach(async () => {
    const logger = new PinoLogger()
    queue = container.resolve(GameDiscoveryQueue)
    steamDiscovery = container.resolve(SteamGameDiscoveryScraper)
    db = container.resolve(DatabaseService)
    job = new GameDiscoveryCronJob(db, queue, steamDiscovery, logger)

    await db.connect()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.getClient().deleteFrom('game').execute()
    await db.disconnect()
  })

  it('should call the steam game discovery scraper', async () => {
    const steamSpy = jest.spyOn(steamDiscovery, 'discoveryGames').mockResolvedValueOnce()
    jest.spyOn(queue, 'add').mockResolvedValueOnce()

    await job.jobFunction()

    expect(steamSpy).toHaveBeenCalled()
  })

  it('should add all games without nuuvem url to the queue', async () => {
    const game = new GameBuilder().withNuuvemUrl(null).build()
    await db.getClient().insertInto('game').values(game).execute()

    const queueSpy = jest.spyOn(queue, 'add').mockResolvedValueOnce()
    jest.spyOn(steamDiscovery, 'discoveryGames').mockResolvedValueOnce()

    await job.jobFunction()

    expect(queueSpy).toHaveBeenCalledTimes(1)
    expect(queueSpy).toHaveBeenCalledWith<[QueueJobName, GameDiscoveryScraperData]>(
      QueueJobName.NUUVEM_GAME_DISCOVERY,
      {
        id: game.id,
        title: game.title
      }
    )
  })

  it('should add all games without green man gaming url to the queue', async () => {
    const game = new GameBuilder().withGreenManGamingUrl(null).build()
    await db.getClient().insertInto('game').values(game).execute()

    const queueSpy = jest.spyOn(queue, 'add').mockResolvedValueOnce()
    jest.spyOn(steamDiscovery, 'discoveryGames').mockResolvedValueOnce()

    await job.jobFunction()

    expect(queueSpy).toHaveBeenCalledTimes(1)
    expect(queueSpy).toHaveBeenCalledWith<[QueueJobName, GameDiscoveryScraperData]>(
      QueueJobName.GREEN_MAN_GAMING_GAME_DISCOVERY,
      {
        id: game.id,
        title: game.title
      }
    )
  })
})
