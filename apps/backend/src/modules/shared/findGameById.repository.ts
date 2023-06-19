import { DatabaseService } from '@database/database.service'
import { type Game } from '@shared/types'
import { injectable } from 'tsyringe'

@injectable()
export class FindGameByIdRepository {
  constructor (private readonly db: DatabaseService) {}

  /**
   * Finds a game by its id.
   * @example
   * ```
   * const game = await findGameByIdRepository.find(gameId)
   * ```
   * @param id - The id of the game.
   */
  async find (id: string): Promise<Game | undefined> {
    return await this.db
      .getClient()
      .selectFrom('game')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }
}
