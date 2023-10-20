import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class UpdateGameUrlRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  /**
   * Update the urls of a game.
   * @example
   * ```
   * await repository.insert(gameId, urls)
   * ```
   * @param gameId - The id of the game
   * @param urls - The urls to be updated
   */
  async update (gameId: string, urls: PlatformUrls): Promise<void> {
    await this.databaseService.getClient()
      .updateTable('game')
      .set({
        nuuvem_url: urls.nuuvem_url,
        green_man_gaming_url: urls.green_man_gaming_url
      })
      .where('id', '=', gameId)
      .execute()
  }
}

interface PlatformUrls {
  nuuvem_url?: string
  green_man_gaming_url?: string
}
