import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class RemoveIgnoredGamesRepository {
  constructor (private readonly database: DatabaseService) {}

  /**
   * Removes a game from the ignored list.
   *
   * @param id The id of the ignore list object.
   *
   * ```
   * await repository.remove(id)
   * ```
   */
  async remove (id: string): Promise<void> {
    await this.database.getClient()
      .deleteFrom('game_ignore_list')
      .where('id', '=', id)
      .execute()
  }
}
