import { DatabaseService } from '@database/database.service'
import { GamePrice } from '@localtypes/entities.type'
import { QueryData } from '@localtypes/http/queryData.type'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

import { GetGamePriceHistoryQuery } from '../query/getGamePriceHistory.query'

@injectable()
export class GetGamePriceHistoryRepository {
  constructor(private databaseService: DatabaseService) {}

  async get(
    gameID: string,
    query: GetGamePriceHistoryQuery
  ): Promise<QueryData<GamePrice[]>> {
    const perPage = Number(query.limit) || 10
    const total = await this.getRegistersCount(gameID)
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((query.page || 1) - 1)

    let dbQuery = this.databaseService
      .getClient()
      .selectFrom('game_price')
      .selectAll()
      .where('game_id', '=', gameID)
      .offset(offset)
      .limit(perPage)
      .orderBy('created_at', 'asc')

    if (query.startDate) {
      dbQuery = dbQuery.where('created_at', '>=', query.startDate)
    }
    if (query.endDate) {
      dbQuery = dbQuery.where('created_at', '<', query.endDate)
    }

    const results = await dbQuery.execute()

    return { results, pages }
  }

  private async getRegistersCount(gameID: string): Promise<number> {
    const queryResult = await sql
      .raw<CountResult>(
        `SELECT COUNT(id) AS total FROM game_price WHERE game_id = "${gameID}"`
      )
      .execute(this.databaseService.getClient())
    return queryResult.rows[0].total
  }
}

interface CountResult {
  total: number
}
