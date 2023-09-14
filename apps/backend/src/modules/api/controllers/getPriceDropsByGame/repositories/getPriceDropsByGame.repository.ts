import { DatabaseService } from '@database/database.service'
import type { GamePriceDrop, QueryData } from '@packages/types'
import { injectable } from 'tsyringe'

import { type GetPriceDropsByGameQuery } from '../query/getPriceDropsByGame.query'

@injectable()
export class GetPriceDropsByGameRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  /**
   * Returns a list of price drops.
   *
   * @example
   * ```
   * const prices = await repository.get(query)
   * ```
   *
   * @param query - The query parameters.
   */
  async get (
    gameId: string,
    query: GetPriceDropsByGameQuery
  ): Promise<QueryData<GamePriceDrop[]>> {
    const perPage = Number.isNaN(Number(query.limit)) ? 10 : Number(query.limit)
    const total = await this.getRegistersCount()
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((Number.isNaN(Number(query.page)) ? 1 : Number(query.page)) - 1)

    let dbQuery = this.databaseService.getClient()
      .selectFrom('game_price_drop')
      .selectAll()
      .where('game_id', '=', gameId)
      .limit(perPage)
      .offset(offset)

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
