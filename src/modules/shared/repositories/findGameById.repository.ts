import { DatabaseService } from '@database/database.service'
import { Game } from '@localtypes/entities.type'
import { injectable } from 'tsyringe'

@injectable()
export class FindGameByIdRepository {
  constructor(private db: DatabaseService) {}

  /**
   * Finds a game by its id.
   * @example
   * ```
   * const game = await findGameByIdRepository.find(gameId)
   * ```
   * @param id - The id of the game.
   */
  async find(id: string): Promise<Game | undefined> {
    return this.db
      .getClient()
      .selectFrom('game')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }
}
