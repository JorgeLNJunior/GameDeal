import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class IsGameExistRepository {
  constructor(private databaseService: DatabaseService) {}

  async get(gameID: string): Promise<boolean> {
    const game = await this.databaseService
      .getClient()
      .selectFrom('game')
      .select('id')
      .where('id', '=', gameID)
      .executeTakeFirst()

    if (game) return true
    return false
  }
}
