import ConfigService from '@config/config.service'
import { DatabaseService } from '@database/database.service'
import { AxiosService } from '@infra/axios.service'
import { PinoLogger } from '@infra/pino.logger'
import { sql } from 'kysely'

import { SteamGameDiscoveryScraper } from './steamGameDiscovery.scraper'

describe('SteamGameDiscoveryScraper', () => {
  let scraper: SteamGameDiscoveryScraper
  let db: DatabaseService

  beforeEach(async () => {
    const axios = new AxiosService()
    const logger = new PinoLogger()
    const config = new ConfigService(logger)
    db = new DatabaseService(config, logger)
    scraper = new SteamGameDiscoveryScraper(db, axios, logger)

    await db.connect()
    await sql`DELETE FROM game`.execute(db.getClient())
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should discover games and insert them in the database', async () => {
    const client = db.getClient()

    await scraper.discoveryGames(5)

    const result = await client
      .selectFrom('game')
      .select(({ fn }) => [fn.count('id').as('total')])
      .executeTakeFirst()

    expect(result?.total).toBeGreaterThan(0)
  }, 1000 * 60)
})
