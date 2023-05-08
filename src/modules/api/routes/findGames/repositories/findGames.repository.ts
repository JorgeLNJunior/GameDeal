import { DatabaseService } from '@database/database.service'
import { Game } from '@localtypes/entities.type'
import { QueryData } from '@localtypes/http/queryData.type'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

import { FindGamesQuery } from '../query/findGames.query'

@injectable()
export class FindGamesRepository {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Gets a list of games.
   * @param query - A query object to filter games.
   * @example
   * ```
   * const games = await gameRepository.find(query)
   * ```
   * @returns A list of games.
   */
  async find(query: FindGamesQuery): Promise<QueryData<Game[]>> {
    const perPage = Number(query.limit) || 10
    const total = await this.getRegistersCount(query.title)
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((query.page || 1) - 1)

    let dbQuery = this.databaseService
      .getClient()
      .selectFrom('game')
      .selectAll()
      .offset(offset)
      .limit(perPage)
      .orderBy('title', 'asc')
    if (query.title) {
      dbQuery = dbQuery.where('title', 'like', `%${query.title}%`)
    }

    const results = await dbQuery.execute()

    return { results, pages }
  }

  private async getRegistersCount(title?: string): Promise<number> {
    let where = null
    if (title) where = `where title like "%${title}%"`
    const queryResult = await sql
      .raw<CountResult>(`SELECT COUNT(id) as total from game ${where}`)
      .execute(this.databaseService.getClient())
    return queryResult.rows[0].total
  }
}

interface CountResult {
  total: number
}
