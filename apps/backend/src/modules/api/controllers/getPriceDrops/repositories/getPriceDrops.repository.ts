import { DatabaseService } from '@database/database.service'
import type { GamePriceDrop, QueryData } from '@packages/types'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

import type { GetPriceDropsQuery } from '../query/getPriceDrops.query'

@injectable()
export class GetPriceDropsRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  /**
   * Returns a list of price drops.
   *
   * @example
   * ```
   * const prices = await getLowestPriceRepository.get(query)
   * ```
   *
   * @param query - The query parameters.
   */
  async get (query: GetPriceDropsQuery): Promise<QueryData<GamePriceDrop[]>> {
    const perPage = Number.isNaN(Number(query.limit)) ? 10 : Number(query.limit)
    const total = await this.getRegistersCount()
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((Number.isNaN(Number(query.page)) ? 1 : Number(query.page)) - 1)

    let dbQuery = this.databaseService.getClient()
      .selectFrom('game_price_drop')
      .selectAll()
      .limit(perPage)
      .offset(offset)

    if (query.date != null) dbQuery = dbQuery.where(sql`date`, '=', sql`CAST(${query.date} as DATE)`)
    if (query.order == null) dbQuery = dbQuery.orderBy('date', 'asc')
    if (query.order === 'asc') dbQuery = dbQuery.orderBy('date', 'asc')
    if (query.order === 'desc') dbQuery = dbQuery.orderBy('date', 'desc')

    const results = await dbQuery.execute()

    return {
      results,
      count: total,
      totalPages: pages,
      page: !Number.isNaN(Number(query.page)) ? Number(query.page) : 1
    }
  }

  private async getRegistersCount (): Promise<number> {
    const result = await this.databaseService.getClient()
      .selectFrom('game_price_drop')
      .select(({ fn }) => [fn.count('id').as('total')])
      .execute()
    return result[0].total as number
  }
}
