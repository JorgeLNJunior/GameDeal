import ConfigService from '@config/config.service'
import { DatabaseService } from '@database/database.service'
import { AxiosService } from '@infra/axios.service'
import { PinoLogger } from '@infra/pino.logger'
import { sql } from 'kysely'

import { SteamGameDiscoveryScraper } from './steamGameDiscovery.scraper'
import { NotificationQueue } from '@queue/notification.queue'

describe('SteamGameDiscoveryScraper', () => {
  let scraper: SteamGameDiscoveryScraper
  let database: DatabaseService
  let notificationQueue: NotificationQueue

  beforeEach(async () => {
    const axios = new AxiosService()
    const logger = new PinoLogger()
    const config = new ConfigService(logger)
    notificationQueue = new NotificationQueue(config, logger)
    database = new DatabaseService(config, logger)
    scraper = new SteamGameDiscoveryScraper(database, axios, notificationQueue, logger)

    await database.connect()
    await sql`DELETE FROM game`.execute(database.getClient())
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(database.getClient())
    await database.disconnect()
  })

  it('should discover games, insert them in the database and notify', async () => {
    const notificationSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValue()
    const client = database.getClient()

    await scraper.discoveryGames(2)

    const result = await client
      .selectFrom('game')
      .select(({ fn }) => [fn.count('id').as('total')])
      .executeTakeFirst()

    expect(result?.total).toBeGreaterThan(0)
    expect(notificationSpy).toHaveBeenCalled()
  }, 1000 * 30)
})
