import { randomUUID } from 'crypto'
import { Kysely, sql } from 'kysely'
import { container } from 'tsyringe'

import { DatabaseService } from './database.service'

describe('DatabaseService', () => {
  let database: DatabaseService

  beforeEach(async () => {
    database = container.resolve(DatabaseService)
  })

  describe('connect', () => {
    afterEach(async () => {
      await sql`DELETE FROM game`.execute(database.getClient())
      await database.disconnect()
    })

    it('should connect', async () => {
      await database.connect()

      await database
        .getClient()
        .insertInto('game')
        .values({
          id: randomUUID(),
          title: 'Test Game',
          steam_url: 'https://steamcommunity.com/id/test'
        })
        .execute()

      const data = await database
        .getClient()
        .selectFrom('game')
        .selectAll()
        .executeTakeFirst()

      expect(data).toBeDefined()
    })
  })

  describe('getClient', () => {
    it('should return a Kysely client', async () => {
      const client = database.getClient()
      expect(client).toBeInstanceOf(Kysely)
    })
  })
})
