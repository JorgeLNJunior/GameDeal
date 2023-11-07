import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class DeleteGameRepository {
  constructor (private readonly database: DatabaseService) {}

  /**
   * Deletes a game from the database.
   *
   * @param gameId The ID of the game.
   *
   * @examples
   * ```
   * await repository.delete(gameId)
   * ```
   */
  async delete (gameId: string): Promise<void> {
    await this.database.getClient()
      .deleteFrom('game')
      .where('id', '=', gameId)
      .execute()
  }
}
