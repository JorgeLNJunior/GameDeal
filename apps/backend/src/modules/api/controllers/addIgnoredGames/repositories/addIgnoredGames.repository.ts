import { DatabaseService } from '@database/database.service'
import { type GameIgnoreList } from '@packages/types'
import { randomUUID } from 'crypto'
import { injectable } from 'tsyringe'

import type { AddIgnoredGamesDto } from '../dto/addIgnoredGames.dto'

@injectable()
export class AddIgnoredGamesRepository {
  constructor (private readonly db: DatabaseService) {}

  /**
   * Adds a list of games on discovery ignore list.
   * @example
   * ```
   * await repository.add(dto)
   * ```
   * @param dto - A list of game titles to insert.
   */
  async add (dto: AddIgnoredGamesDto): Promise<GameIgnoreList[]> {
    const data: GameIgnoreList[] = []

    await this.db
      .getClient()
      .transaction()
      .execute(async (trx) => {
        for (const title of dto.titles) {
          const id = randomUUID()
          await trx
            .insertInto('game_ignore_list')
            .values({
              id,
              title
            })
            .execute()
          data.push({ id, title })
        }
      })

    return data
  }
}
