import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class FindGameScraperDataRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  /**
   * Gets a list of games with only the id and steam_url keys.
   * @example
   * ```
   * const games = await findGameScraperDataRepository.find()
   * ```
   * @returns A list of games.
   */
  async find (): Promise<GameScrapeData[]> {
    return await this.databaseService
      .getClient()
      .selectFrom('game')
      .select(['id', 'steam_url', 'nuuvem_url'])
      .execute()
  }
}

interface GameScrapeData {
  id: string
  steam_url: string
  nuuvem_url: string | null
}
