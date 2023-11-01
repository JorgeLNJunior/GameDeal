import { DatabaseService } from '@database/database.service'
import type { GameIgnoreList, QueryData } from '@packages/types'
import { injectable } from 'tsyringe'

import { type GetIgnoredGamesQuery } from '../query/getIgnoredGames.query'

@injectable()
export class GetIgnoredGamesRepository {
  constructor (private readonly database: DatabaseService) {}

  /**
   * Gets a list of ignored games.
   *
   * @param query - A query object to filter games.
   *
   * @example
   * ```
   * const games = await gameRepository.get(query)
   * ```
   * @returns A list of ignored games.
   */
  async get (query: GetIgnoredGamesQuery): Promise<QueryData<GameIgnoreList[]>> {
    const perPage = Number.isNaN(Number(query.limit)) ? 10 : Number(query.limit)
    const total = await this.getRegistriesCount()
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((Number.isNaN(Number(query.page)) ? 1 : Number(query.page)) - 1)

    let dbQuery = this.database.getClient()
      .selectFrom('game_ignore_list')
      .selectAll()
      .offset(offset)
      .limit(perPage)

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

  private async getRegistriesCount (): Promise<number> {
    const result = await this.database.getClient()
      .selectFrom('game_ignore_list')
      .select(({ fn }) => [fn.count('id').as('total')])
      .executeTakeFirstOrThrow()

    return result.total as number
  }
}
