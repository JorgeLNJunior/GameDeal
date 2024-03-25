import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class FindNuuvemURLsRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  async find (): Promise<NuuvemURL[]> {
    const client = this.databaseService.getClient()

    return await client
      .selectFrom('game')
      .select(['id as game_id', 'nuuvem_url as url'])
      .where('nuuvem_url', 'is not', null)
      .execute() as NuuvemURL[]
  }
}

interface NuuvemURL {
  game_id: string
  url: string
}
