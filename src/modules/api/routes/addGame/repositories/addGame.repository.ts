import { DatabaseService } from '@database/database.service'
import { Game } from '@localtypes/entities.type'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

import { AddGameDTO } from '../dto/addGame.dto'

@injectable()
export class AddGameRepository {
  constructor(private db: DatabaseService) {}

  /**
   * Adds a new game.
   *
   * @example
   * ```
   * const game = await addGameRespository.add(dto)
   * ```
   * @param dto - The data required to insert a game.
   * @returns A `Game` object.
   */
  async add(dto: AddGameDTO): Promise<Game> {
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
            title: dto.title,
            steam_url: dto.steam_url,
            nuuvem_url: dto.nuuvem_url
          })
          .executeTakeFirstOrThrow()

        return trx
          .selectFrom('game')
          .selectAll()
          .where('id', '=', uuid)
          .executeTakeFirstOrThrow()
      })
  }
}
