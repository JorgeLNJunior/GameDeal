import ConfigService from '@config/config.service'
import { DatabaseService } from '@database/database.service'
import { AxiosService } from '@infra/axios.service'
import { PinoLogger } from '@infra/pino.logger'
import { randomUUID } from 'crypto'
import { sql } from 'kysely'

import { NuuvemGameDiscoveryScraper } from './nuuvemGameDiscovery.scraper'

describe('NuuvemGameDiscoveryScraper', () => {
  let scraper: NuuvemGameDiscoveryScraper
  let db: DatabaseService

  beforeEach(async () => {
    const axios = new AxiosService()
    const logger = new PinoLogger()
    const config = new ConfigService(logger)
    db = new DatabaseService(config, logger)
    scraper = new NuuvemGameDiscoveryScraper(db, axios, logger)

    await db.connect()
    await sql`DELETE FROM game`.execute(db.getClient())
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await db.disconnect()
  })

  it('should discover games and insert them in the database', async () => {
    const client = db.getClient()

    await client.insertInto('game').values({
      id: randomUUID(),
      title: 'God of War',
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War'
    }).execute()
    await client.insertInto('game').values({
      id: randomUUID(),
      title: 'ELDEN RING',
      steam_url: 'https://store.steampowered.com/app/1245620/ELDEN_RING'
    }).execute()
    await client.insertInto('game').values({
      id: randomUUID(),
      title: 'Monster Hunter: World',
      steam_url: 'https://store.steampowered.com/app/582010/Monster_Hunter_World'
    }).execute()
    await client.insertInto('game').values({
      id: randomUUID(),
      title: 'DARK SOULS™ III',
      steam_url: 'https://store.steampowered.com/app/374320/DARK_SOULS_III'
    }).execute()

    await scraper.discoveryGames()

    const result = await client
      .selectFrom('game')
      .select(({ fn }) => [fn.count('id').as('total')])
      .where('nuuvem_url', 'is not', null)
      .executeTakeFirst()

    expect(result?.total).toBe(4)
  }, 1000 * 60)
})
