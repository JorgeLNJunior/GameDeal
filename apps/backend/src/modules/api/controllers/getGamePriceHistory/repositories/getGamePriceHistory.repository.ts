import { DatabaseService } from '@database/database.service'
import type { GamePrice, QueryData } from '@packages/types'
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
    const total = await this.getRegistriesCount(gameID, query.startDate, query.endDate)
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((Number.isNaN(Number(query.page)) ? 1 : Number(query.page)) - 1)

    let dbQuery = this.databaseService
      .getClient()
      .selectFrom('game_price')
      .selectAll()
      .where('game_id', '=', gameID)
      .offset(offset)
      .limit(perPage)

    if (query.startDate != null) dbQuery = dbQuery.where('date', '>=', sql`CAST(${query.startDate} as DATE)`)
    if (query.endDate != null) dbQuery = dbQuery.where('date', '<=', sql`CAST(${query.endDate} as DATE)`)
    if (query.order == null) dbQuery = dbQuery.orderBy('date', 'asc')
    if (query.order === 'asc') dbQuery = dbQuery.orderBy('date', 'asc')
    if (query.order === 'desc') dbQuery = dbQuery.orderBy('date', 'desc')

    const results = await dbQuery.execute()

    return {
      results,
      totalPages: pages,
      count: total,
      page: !Number.isNaN(Number(query.page)) ? Number(query.page) : 1
    }
  }

  private async getRegistriesCount (
    gameID: string,
    startDate?: string,
    endDate?: string
  ): Promise<number> {
    let where = `WHERE game_id = "${gameID}"`
    if (startDate != null) {
      where = where + ` AND date >= CAST("${startDate}" as DATE)`
    }
    if (endDate != null) {
      where = where + ` AND date <= CAST("${endDate}" as DATE)`
    }
    const queryResult = await sql
      .raw<CountResult>(
        `SELECT COUNT(id) AS total FROM game_price ${where}`
    )
      .execute(this.databaseService.getClient())
    return queryResult.rows[0].total
  }
}

interface CountResult {
  total: number
}
