import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class FindGMGURLsRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  async find (): Promise<GMGURL[]> {
    const client = this.databaseService.getClient()

    return await client
      .selectFrom('game')
      .select(['id as game_id', 'green_man_gaming_url as url'])
      .where('green_man_gaming_url', 'is not', null)
      .execute() as GMGURL []
  }
}

interface GMGURL {
  game_id: string
  url: string
}
