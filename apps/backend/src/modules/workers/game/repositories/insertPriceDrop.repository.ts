import { DatabaseService } from '@database/database.service'
import type { GamePriceDrop } from '@packages/types'
import { sql } from 'kysely'
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
  async insert (data: PriceDropData): Promise<GamePriceDrop> {
    return await this.databaseService
      .getClient()
      .transaction()
      .execute(async (trx) => {
        const uuidResult = await sql<
        Record<string, string>
        >`SELECT UUID()`.execute(trx)

        const uuid = uuidResult.rows[0]['UUID()']

        await trx
          .insertInto('game_price_drop')
          .values({
            id: uuid,
            game_id: data.game_id,
            platform: data.platform,
            old_price: data.old_price,
            discount_price: data.discount_price
          })
          .execute()

        return await trx
          .selectFrom('game_price_drop')
          .selectAll()
          .where('id', '=', uuid)
          .executeTakeFirstOrThrow()
      })
  }
}

type PriceDropData = Pick<GamePriceDrop, 'game_id' | 'platform' | 'old_price' | 'discount_price'>
