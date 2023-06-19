import { DatabaseService } from '@database/database.service'
import type { GamePrice, QueryData } from '@shared/types'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

import { type GetGamePriceHistoryQuery } from '../query/getGamePriceHistory.query'

@injectable()
export class GetGamePriceHistoryRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  async get (
    gameID: string,
    query: GetGamePriceHistoryQuery
  ): Promise<QueryData<GamePrice[]>> {
    const perPage = Number.isNaN(Number(query.limit)) ? 10 : Number(query.limit)
    const total = await this.getRegistersCount(gameID)
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((Number.isNaN(Number(query.page)) ? 1 : Number(query.page)) - 1)

    let dbQuery = this.databaseService
      .getClient()
      .selectFrom('game_price')
      .selectAll()
      .where('game_id', '=', gameID)
      .offset(offset)
      .limit(perPage)
      .orderBy('created_at', 'asc')

    if (query.startDate != null) {
      dbQuery = dbQuery.where('created_at', '>=', query.startDate)
    }
    if (query.endDate != null) {
      dbQuery = dbQuery.where('created_at', '<', query.endDate)
    }

    const results = await dbQuery.execute()

    return { results, pages }
  }

  private async getRegistersCount (gameID: string): Promise<number> {
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
