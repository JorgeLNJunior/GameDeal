import { DatabaseService } from '@database/database.service'
import { GamePrice } from '@localtypes/entities.type'
import { randomUUID } from 'crypto'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { GetLowestHistoricalPriceRepository } from './getLowestHistoricalPrice.repository'

describe('GetLowestHistoricalPriceRepository', () => {
  let repository: GetLowestHistoricalPriceRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetLowestHistoricalPriceRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a price', async () => {
    const game = {
      id: randomUUID(),
      title: 'Kerbal Space Program',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url'
    }
    const price = {
      id: randomUUID(),
      game_id: game.id,
      steam_price: 50.55,
      nuuvem_price: 45.99
    }
    const price2 = {
      id: randomUUID(),
      game_id: game.id,
      steam_price: 85.99,
      nuuvem_price: 74.99
    }
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()
    await db.getClient().insertInto('game_price').values(price2).execute()

    const data = await repository.get(game.id)

    expect((data as GamePrice).id).toBe(price.id)
    expect((data as GamePrice).game_id).toBe(price.game_id)
    expect((data as GamePrice).steam_price).toBe(String(price.steam_price))
    expect((data as GamePrice).nuuvem_price).toBe(String(price.nuuvem_price))
  })
})
