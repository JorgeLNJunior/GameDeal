import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class FindGameScraperDataRepository {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Gets a list of games with only the id and steam_url keys.
   *
   * @example
   * ```
   * const games = await findGameScraperDataRepository.find()
   * ```
   * @returns A list of games.
   */
  async find() {
    return this.databaseService
      .getClient()
      .selectFrom('game')
      .select(['id', 'steam_url', 'nuuvem_url', 'gamers_gate_url'])
      .execute()
  }
}
