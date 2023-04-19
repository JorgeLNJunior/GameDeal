import { DatabaseService } from '@database/database.service'
import { Game } from '@localtypes/entities.type'
import { injectable } from 'tsyringe'

@injectable()
export class FindGamesRepository {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Gets a list of games.
   *
   * @example
   * ```
   * const games = await gameRepository.find()
   * ```
   * @returns A list of games.
   */
  async find(): Promise<Game[]> {
    return this.databaseService
      .getClient()
      .selectFrom('game')
      .selectAll()
      .execute()
  }
}
