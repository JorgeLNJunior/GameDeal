import { DatabaseService } from '@database/database.service'
import { GamePrice } from '@localtypes/entities.type'
import { injectable } from 'tsyringe'

@injectable()
export class GetCurrentGamePriceRepository {
  constructor(private db: DatabaseService) {}

  /**
   * Gets the last registred game price.
   * @example
   * ```
   * const price = await gameRepository.getPrice()
   * ```
   * @param gameId - The id of the game.
   */
  async getPrice(gameId: string): Promise<GamePrice | undefined> {
    return this.db
      .getClient()
      .selectFrom('game_price')
      .selectAll()
      .where('game_id', '=', gameId)
      .orderBy('created_at', 'desc')
      .limit(1)
      .executeTakeFirst()
  }
}
