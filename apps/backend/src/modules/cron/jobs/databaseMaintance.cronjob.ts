import { DatabaseService } from '@database/database.service'
import { type ApplicationCronJob } from '@localtypes/cron.type'
import { CompiledQuery } from 'kysely'
import { injectable } from 'tsyringe'

@injectable()
export class DatabaseMaintanceCronJob implements ApplicationCronJob {
  public readonly cronTime: string = '18 12 * * 0' // At UTC-3 12:18 on Sunday

  constructor(private readonly database: DatabaseService) { }

  async jobFunction(): Promise<void> {
    const client = this.database.getClient()
    await client.executeQuery(CompiledQuery.raw('OPTIMIZE TABLE game'))
    await client.executeQuery(CompiledQuery.raw('OPTIMIZE TABLE game_price'))
    await client.executeQuery(CompiledQuery.raw('OPTIMIZE TABLE game_price_drop'))
    await client.executeQuery(CompiledQuery.raw('OPTIMIZE TABLE game_ignore_list'))
  }
}
