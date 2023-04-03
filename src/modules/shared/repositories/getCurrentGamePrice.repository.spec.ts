import { DatabaseService } from '@database/database.service'
import { randomUUID } from 'crypto'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { GetCurrentGamePriceRepository } from './getCurrentGamePrice.repository'

describe('GetCurrentGamePriceRepository', () => {
  let repository: GetCurrentGamePriceRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetCurrentGamePriceRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return the current game price', async () => {
    const gameData = {
      id: randomUUID(),
      title: 'God of War',
      steam_url: 'steam_url',
      nuuvem_url: 'nuuvem_url'
    }
    const priceData = {
      id: randomUUID(),
      game_id: gameData.id,
      steam_price: 175.45,
      nuuvem_price: 190.55
    }
    await db.getClient().insertInto('game').values(gameData).execute()
    await db.getClient().insertInto('game_price').values(priceData).execute()

    const price = await repository.getPrice(gameData.id)

    expect(price?.steam_price).toBe(priceData.steam_price.toString())
    expect(price?.nuuvem_price).toBe(priceData.nuuvem_price.toString())
  })
})
