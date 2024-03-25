import { DatabaseService } from '@database/database.service'
import { injectable } from 'tsyringe'

@injectable()
export class RemoveStoreURLRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  async remove (gameID: string, nuuvem: boolean, gmg: boolean): Promise<void> {
    const client = this.databaseService.getClient()

    await client
      .updateTable('game')
      .set({
        nuuvem_url: nuuvem ? null : undefined,
        green_man_gaming_url: gmg ? null : undefined
      })
      .where('id', '=', gameID)
      .execute()
  }
}
