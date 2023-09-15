import { DatabaseService } from '@database/database.service'
import type { Game, QueryData } from '@packages/types'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

import { type FindGamesQuery } from '../query/findGames.query'

@injectable()
export class FindGamesRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  /**
   * Gets a list of games.
   *
   * @param query - A query object to filter games.
   *
   * @example
   * ```
   * const games = await gameRepository.find(query)
   * ```
   * @returns A list of games.
   */
  async find (query: FindGamesQuery): Promise<QueryData<Game[]>> {
    const perPage = Number.isNaN(Number(query.limit)) ? 10 : Number(query.limit)
    const total = await this.getRegistriesCount(query.title)
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((Number.isNaN(Number(query.page)) ? 1 : Number(query.page)) - 1)

    let dbQuery = this.databaseService
      .getClient()
      .selectFrom('game')
      .selectAll()
      .where(({ selectFrom, exists }) =>
        exists(
          selectFrom('game_price')
            .select('id')
            .whereRef('game.id', '=', 'game_price.game_id')
            .limit(1)
        )
      )
      .offset(offset)
      .limit(perPage)

    if (query.title != null) {
      dbQuery = dbQuery.where(sql`MATCH`, sql`(title)`, sql`AGAINST ("${query.title}" IN NATURAL LANGUAGE MODE)`)
    }
    if (query.order == null) dbQuery = dbQuery.orderBy('title', 'asc')
    if (query.order === 'asc') dbQuery = dbQuery.orderBy('title', 'asc')
    if (query.order === 'desc') dbQuery = dbQuery.orderBy('title', 'desc')

    const results = await dbQuery.execute()

    return {
      results,
      totalPages: pages,
      count: total,
      page: !Number.isNaN(Number(query.page)) ? Number(query.page) : 1
    }
  }

  private async getRegistriesCount (title?: string): Promise<number> {
    let where = ''
    if (title != null) where = `WHERE MATCH (title) AGAINST ("${title}")`
    const queryResult = await sql
      .raw<CountResult>(`SELECT COUNT(id) AS total FROM game ${where}`)
      .execute(this.databaseService.getClient())
    return queryResult.rows[0].total
  }
}

interface CountResult {
  total: number
}
