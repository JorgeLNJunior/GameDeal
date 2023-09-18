import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class CountGamesRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  async count (): Promise<number> {
    const result = await this.databaseService.getClient()
      .selectFrom('game')
      .select(({ fn }) => [fn.count('id').as('total')])
      .execute()
    return result.at(0)?.total as number
  }
}
