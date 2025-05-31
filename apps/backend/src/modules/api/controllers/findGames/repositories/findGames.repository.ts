import { Database } from '@database/database.interface'
import { DatabaseService } from '@database/database.service'
import type { Game, QueryData } from '@packages/types'
import { SelectExpression, sql } from 'kysely'
import { ExpressionBuilder } from 'kysely/dist/cjs/expression/expression-builder'
import { jsonObjectFrom } from 'kysely/helpers/mysql'
import { injectable } from 'tsyringe'

import { type FindGamesQuery } from '../query/findGames.query'

@injectable()
export class FindGamesRepository {
  constructor(private readonly databaseService: DatabaseService) { }

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
  async find(query: FindGamesQuery): Promise<QueryData<Game[]>> {
    const perPage = Number.isNaN(Number(query.limit)) ? 10 : Number(query.limit)
    const total = await this.getRegistriesCount(query.title)
    const pages = Math.ceil(total / perPage)
    const offset = perPage * ((Number.isNaN(Number(query.page)) ? 1 : Number(query.page)) - 1)

    let dbQuery = this.databaseService
      .getClient()
      .selectFrom('game')
      .select((eb) => this.buildSelectQuery(query, eb))
      // .selectAll()
      .where(({ selectFrom, exists }) => // select only if there's at least one price registered.
        exists(
          selectFrom('game_price')
            .select('game_price.id')
            .whereRef('game.id', '=', 'game_price.game_id')
            .limit(1)
        )
      )
      .offset(offset)
      .limit(perPage)

    if (query.title != null) {
      query.title += '*' // see MySQL full text search boolean mode
      dbQuery = dbQuery.where(sql`MATCH`, sql`(title)`, sql`AGAINST (${query.title} IN BOOLEAN MODE)`)

      if (query.order === 'asc') dbQuery = dbQuery.orderBy('title', 'asc')
      if (query.order === 'desc') dbQuery = dbQuery.orderBy('title', 'desc')
    } else {
      if (query.order === 'asc' || query.order == null) dbQuery = dbQuery.orderBy('title', 'asc')
      if (query.order === 'desc') dbQuery = dbQuery.orderBy('title', 'desc')
    }

    const results = await dbQuery.execute()

    return {
      results,
      totalPages: pages,
      count: total,
      page: !Number.isNaN(Number(query.page)) ? Number(query.page) : 1
    }
  }

  private buildSelectQuery(query: FindGamesQuery, eb: ExpressionBuilder<Database, 'game'>): SelectExpression<Database, 'game'>[] {
    const selectExpression: SelectExpression<Database, 'game'>[] = [
      'game.id',
      'game.title',
      'game.steam_url',
      'game.green_man_gaming_url',
      'game.nuuvem_url',
      'game.created_at',
      'game.updated_at'
    ]

    if (query.prices) {
      const pricesQuery = jsonObjectFrom(eb
        .selectFrom('game_price')
        .select([
          'game_price.id',
          'game_price.game_id',
          'game_price.steam_price',
          'game_price.nuuvem_price',
          'game_price.green_man_gaming_price',
          'game_price.date'
        ])
        .whereRef('game.id', '=', 'game_price.game_id')
      ).as('prices')
      selectExpression.push(pricesQuery)
    }

    return selectExpression
  }

  private async getRegistriesCount(title?: string): Promise<number> {
    let query = this.databaseService.getClient()
      .selectFrom('game')
      .select(({ fn }) => [fn.count('id').as('total')])
      .where(({ selectFrom, exists }) =>
        exists(
          selectFrom('game_price')
            .select('id')
            .whereRef('game.id', '=', 'game_price.game_id')
            .limit(1)
        )
      )

    if (title != null) {
      title += '*'
      query = query.where(sql`MATCH`, sql`(title)`, sql`AGAINST (${title} IN BOOLEAN MODE)`)
    }

    const result = await query.execute()
    return result[0].total as number
  }
}
