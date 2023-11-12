import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class IsIgnoredGameExistsRepository {
  constructor (private readonly database: DatabaseService) {}

  /**
   * Verifies if a game is in the ignore list.
   *
   * @param id The id of the ignore list object.
   *
   * @example
   * ```
   * await repository.exists(id)
   * ```
   */
  async exists (id: string): Promise<boolean> {
    const ignoredGame = await this.database.getClient()
      .selectFrom('game_ignore_list')
      .select(['id'])
      .where('id', '=', id)
      .executeTakeFirst()

    if (ignoredGame != null) return true
    return false
  }
}
