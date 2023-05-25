import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class IsGameAlreadyInsertedRepository {
  constructor(private db: DatabaseService) {}

  /**
   * Verifies if a game is already inserted.
   * @example
   * ```
   * const isAlreadyInserted = await isGameAlreadyInsertedRepository.handle('God of War')
   * ```
   * @param gameTitle - The title of the game.
   */
  async handle(gameTitle: string): Promise<boolean> {
    const result = await this.db
      .getClient()
      .selectFrom('game')
      .select('id')
      .where('title', '=', gameTitle)
      .executeTakeFirst()

    if (result?.id) return true
    return false
  }
}
