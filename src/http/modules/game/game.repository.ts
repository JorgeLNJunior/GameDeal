import { sql } from 'kysely'
import { injectable } from 'tsyringe'

import { DatabaseService } from '../../../database/database.service'
import { AddGameDTO } from './dto/addGame.dto'

@injectable()
export class GameRepository {
  constructor(private db: DatabaseService) {}

  /**
   * Add a new game.
   *
   * ```
   * const game = await gameRespository.create(dto)
   * ```
   *
   * @param dto The data required to insert a game.
   * @returns A `Game` object.
   */
  async create(dto: AddGameDTO) {
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
   * Verify if a game is already insert.
   *
   * ```
   * const isAlreadyInsert = await gameRepository.isAlreadyInsert('God of War')
   * ```
   *
   * @param gameTitle The title of the game.
   */
  async isAlreadyInsert(gameTitle: string): Promise<boolean> {
    const result = await this.db
      .getClient()
      .selectFrom('game')
      .select('id')
      .where('title', '=', gameTitle)
      .executeTakeFirst()

    if (result?.id) return true
    return false
  }
}
