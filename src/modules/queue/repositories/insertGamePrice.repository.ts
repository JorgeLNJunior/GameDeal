import { DatabaseService } from '@database/database.service'
import { GamePrice } from '@localtypes/entities.type'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

@injectable()
export class InsertGamePriceRepository {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Inserts a new value to a game price history.
   *
   * @example
   * ```
   * await gameRepository.insertPrice(gameId, price)
   * ```
   * @param gameId - The id of the game
   * @param prices - The current prices of the game
   * @returns A `GamePrice` object.
   */
  async insert(gameId: string, prices: PlatformPrices): Promise<GamePrice> {
    return this.databaseService
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
            nuuvem_price: prices.nuuvem_price
          })
          .execute()

        return trx
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
}
