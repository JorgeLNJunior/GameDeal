import { DatabaseService } from '@database/database.service'
import type { Game } from '@packages/types'
import { randomUUID } from 'crypto'
import { injectable } from 'tsyringe'

import type { AddGameDTO } from '../dto/addGame.dto'

@injectable()
export class AddGameRepository {
  constructor (private readonly db: DatabaseService) {}

  /**
   * Adds a new game.
   * @example
   * ```
   * const game = await addGameRespository.add(dto)
   * ```
   * @param dto - The data required to insert a game.
   * @returns A `Game` object.
   */
  async add (dto: AddGameDTO): Promise<Game> {
    const client = this.db.getClient()
    const id = randomUUID()

    await client
      .insertInto('game')
      .values({
        id,
        title: dto.title,
        steam_url: dto.steam_url,
        nuuvem_url: dto.nuuvem_url,
        green_man_gaming_url: dto.green_man_gaming_url
      })
      .execute()

    return await client
      .selectFrom('game')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
  }
}
