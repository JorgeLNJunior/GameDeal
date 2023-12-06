import { DatabaseService } from '@database/database.service'
import type { GamePrice } from '@packages/types'
import { randomUUID } from 'crypto'
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
  async insert (gameId: string, prices: StorePrices): Promise<GamePrice> {
    const client = this.databaseService.getClient()
    const id = randomUUID()

    await client
      .insertInto('game_price')
      .values({
        id,
        game_id: gameId,
        steam_price: prices.steam_price,
        nuuvem_price: prices.nuuvem_price,
        green_man_gaming_price: prices.green_man_gaming_price
      })
      .execute()

    return await client
      .selectFrom('game_price')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
  }
}

interface StorePrices {
  steam_price: number
  nuuvem_price: number | null
  green_man_gaming_price: number | null
}
