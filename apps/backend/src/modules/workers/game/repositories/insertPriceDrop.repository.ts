import { DatabaseService } from '@database/database.service'
import type { GamePriceDrop } from '@packages/types'
import { randomUUID } from 'crypto'
import { injectable } from 'tsyringe'

@injectable()
export class InsertPriceDropRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  /**
   * Inserts a new value to a game price drop history.
   * @example
   * ```
   * await repository.insertPrice(data)
   * ```
   * @param gameId - All the required data.
   * @returns A `GamePriceDrop` object.
   */
  async insert (data: PriceDropInsertData): Promise<GamePriceDrop> {
    const client = this.databaseService.getClient()
    const id = randomUUID()

    await client
      .insertInto('game_price_drop')
      .values({
        id,
        game_id: data.game_id,
        store: data.store,
        old_price: data.old_price,
        discount_price: data.discount_price
      })
      .execute()

    return await client
      .selectFrom('game_price_drop')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
  }
}

export type PriceDropInsertData = Pick<GamePriceDrop, 'game_id' | 'store' | 'old_price' | 'discount_price'>
