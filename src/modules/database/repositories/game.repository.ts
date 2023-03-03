import { sql } from 'kysely'
import { injectable } from 'tsyringe'

import { DatabaseService } from '../../../modules/database/database.service'
import { AddGameDTO } from './dto/addGame.dto'

@injectable()
export class GameRepository {
  constructor(private db: DatabaseService) {}

  /**
   * Adds a new game.
   *
   * @example
   * ```
   * const game = await gameRespository.create(dto)
   * ```
   * @param dto - The data required to insert a game.
   * @returns A `Game` object.
   */
  async create(dto: AddGameDTO): Promise<Game> {
    return this.db
      .getClient()
      .transaction()
      .execute(async (trx) => {
        const uuidResult = await sql<
          Record<string, string>
        >`select UUID()`.execute(trx)

        const uuid = uuidResult.rows[0]['UUID()']

        await trx
          .insertInto('game')
          .values({
            id: uuid,
            ...dto
          })
          .executeTakeFirstOrThrow()

        return trx
          .selectFrom('game')
          .selectAll()
          .where('id', '=', uuid)
          .executeTakeFirstOrThrow()
      })
  }

  /**
   * Verifies if a game is already inserted.
   *
   * @example
   * ```
   * const isAlreadyInserted = await gameRepository.isAlreadyInserted('God of War')
   * ```
   * @param gameTitle - The title of the game.
   */
  async isAlreadyInserted(gameTitle: string): Promise<boolean> {
    const result = await this.db
      .getClient()
      .selectFrom('game')
      .select('id')
      .where('title', '=', gameTitle)
      .executeTakeFirst()

    if (result?.id) return true
    return false
  }

  /**
   * Inserts a new value to a game price history.
   *
   * @example
   * ```
   * await gameRepository.insertPrice(gameId, price)
   * ```
   * @param gameId - The id of the game
   * @param prices - The current prices of the game
   * @returns A `GamePrice` object.
   */
  async insertPrice(
    gameId: string,
    prices: PlatformPrices
  ): Promise<GamePrice> {
    return this.db
      .getClient()
      .transaction()
      .execute(async (trx) => {
        const uuidResult = await sql<
          Record<string, string>
        >`SELECT UUID()`.execute(trx)

        const uuid = uuidResult.rows[0]['UUID()']

        await trx
          .insertInto('game_price')
          .values({
            id: uuid,
            game_id: gameId,
            steam_price: prices.steam_price
          })
          .execute()

        return trx
          .selectFrom('game_price')
          .selectAll()
          .where('id', '=', uuid)
          .executeTakeFirstOrThrow()
      })
  }

  /**
   * Gets a list of games with only the id and steam_url keys.
   *
   * @example
   * ```
   * const games = await gameRepository.findSteamScraperData()
   * ```
   * @returns A list of games.
   */
  async findSteamScraperData() {
    return this.db
      .getClient()
      .selectFrom('game')
      .select(['id', 'steam_url'])
      .execute()
  }

  /**
   * Gets a list of games.
   *
   * @example
   * ```
   * const games = await gameRepository.find()
   * ```
   * @returns A list of games.
   */
  async find(): Promise<Game[]> {
    return this.db.getClient().selectFrom('game').selectAll().execute()
  }

  /**
   * Finds a game by its id.
   *
   * @example
   * ```
   * const game = await gameRepository.findById(gameId)
   * ```
   * @param id - The id of the game.
   */
  async findById(id: string): Promise<Game | undefined> {
    return this.db
      .getClient()
      .selectFrom('game')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }

  /**
   * Gets the last registred game price.
   *
   * @example
   * ```
   * const price = await gameRepository.getPrice()
   * ```
   * @param gameId - The id of the game.
   */
  async getPrice(gameId: string): Promise<GamePrice | undefined> {
    return this.db
      .getClient()
      .selectFrom('game_price')
      .selectAll()
      .where('game_id', '=', gameId)
      .orderBy('created_at', 'desc')
      .limit(1)
      .executeTakeFirst()
  }
}

interface PlatformPrices {
  steam_price: number
}

export interface Game {
  id: string
  title: string
  steam_url: string
  nuuvem_url: string | null
  green_man_gaming_url: string | null
  created_at: Date
  updated_at: Date | null
}

export interface GamePrice {
  id: string
  game_id: string
  steam_price: number
  nuuvem_price: number | null
  green_man_gaming_price: number | null
  created_at: Date
  updated_at: Date | null
}
