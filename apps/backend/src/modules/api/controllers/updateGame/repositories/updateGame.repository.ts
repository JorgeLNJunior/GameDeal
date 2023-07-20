import { DatabaseService } from '@database/database.service'
import type { Game } from '@packages/types'
import { injectable } from 'tsyringe'

import { type UpdateGameDTO } from '../dto/updateGame.dto'

@injectable()
export class UpdateGameRepository {
  constructor (private readonly db: DatabaseService) {}

  /**
   * Updates a game.
   * @example
   * ```
   * const game = await updateGameRespository.update(dto)
   * ```
   * @param dto - The data required to update a game.
   * @returns A `Game` object.
   */
  async update (id: string, dto: UpdateGameDTO): Promise<Game | undefined> {
    const client = this.db.getClient()
    await client
      .updateTable('game')
      .set({
        title: dto.title,
        steam_url: dto.steam_url,
        nuuvem_url: dto.nuuvem_url
      })
      .where('id', '=', id)
      .execute()
    return await client
      .selectFrom('game')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }
}
