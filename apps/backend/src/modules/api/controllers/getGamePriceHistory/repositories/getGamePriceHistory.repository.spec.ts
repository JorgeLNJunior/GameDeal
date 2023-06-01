import { DatabaseService } from '@database/database.service'
import { GameBuilder } from '@testing/builders/game.builder'
import { GamePriceBuilder } from '@testing/builders/price.builder'
import { sql } from 'kysely'
import { container } from 'tsyringe'

import { GetGamePriceHistoryRepository } from './getGamePriceHistory.repository'

describe('GetGamePriceHistoryRepository', () => {
  let repository: GetGamePriceHistoryRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GetGamePriceHistoryRepository(db)

    await db.connect()
  })

  afterEach(async () => {
    await sql`DELETE FROM game`.execute(db.getClient())
    await sql`DELETE FROM game_price`.execute(db.getClient())
    await db.disconnect()
  })

  it('should return a list of prices', async () => {
    const game = new GameBuilder().build()
    const price = new GamePriceBuilder().withGame(game.id).build()
    await db.getClient().insertInto('game').values(game).execute()
    await db.getClient().insertInto('game_price').values(price).execute()

    const data = await repository.get(game.id, {})

    expect(data.results[0].id).toBe(price.id)
    expect(data.results[0].game_id).toBe(price.game_id)
    expect(data.results[0].steam_price).toBe(String(price.steam_price))
    expect(data.results[0].nuuvem_price).toBe(String(price.nuuvem_price))
  })
})
