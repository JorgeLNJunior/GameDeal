import { DatabaseService } from '@database/database.service'
import type { GamePrice } from '@packages/types'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

@injectable()
export class InsertGamePriceRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  /**
   * Inserts a new value to a game price history.
   * @example
   * ```
   * await repository.insert(gameId, prices)
   * ```
   * @param gameId - The id of the game
   * @param prices - The current prices of the game
   * @returns A `GamePrice` object.
   */
  async insert (gameId: string, prices: PlatformPrices): Promise<GamePrice> {
    return await this.databaseService
      .getClient()
      .transaction()
      .execute(async (trx) => {
        const uuidResult = await sql<
        Record<string, string>
        >`SELECT UUID()`.execute(trx)

        const uuid = uuidResult.rows[0]['UUID()']

        await trx
          .insertInto('game_price')
          .values({
            id: uuid,
            game_id: gameId,
            steam_price: prices.steam_price,
            nuuvem_price: prices.nuuvem_price,
            green_man_gaming_price: prices.green_man_gaming_price
          })
          .execute()

        return await trx
          .selectFrom('game_price')
          .selectAll()
          .where('id', '=', uuid)
          .executeTakeFirstOrThrow()
      })
  }
}

interface PlatformPrices {
  steam_price: number
  nuuvem_price: number | null
  green_man_gaming_price: number | null
}
