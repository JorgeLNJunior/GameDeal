import { DatabaseService } from '@database/database.service'
import { type GamePrice } from '@packages/types'
import { injectable } from 'tsyringe'

@injectable()
export class GetCurrentGamePriceRepository {
  constructor (private readonly db: DatabaseService) {}

  /**
   * Gets the last registred game price.
   * @example
   * ```
   * const price = await gameRepository.getPrice()
   * ```
   * @param gameId - The id of the game.
   */
  async getPrice (gameId: string): Promise<GamePrice | undefined> {
    return await this.db
      .getClient()
      .selectFrom('game_price')
      .selectAll()
      .where('game_id', '=', gameId)
      .orderBy('date', 'desc')
      .limit(1)
      .executeTakeFirst()
  }
}
