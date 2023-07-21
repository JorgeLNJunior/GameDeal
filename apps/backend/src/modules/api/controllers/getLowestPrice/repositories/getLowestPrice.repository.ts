import { DatabaseService } from '@database/database.service'
import type { GamePrice, LowestPrice } from '@packages/types'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

@injectable()
export class GetLowestPriceRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  async get (gameID: string): Promise<LowestPrice> {
    const steamPrice = await sql
      .raw<GamePrice>(
        `SELECT * FROM game_price
          WHERE game_id = "${gameID}"
          AND steam_price = (SELECT MIN(steam_price) FROM game_price where game_id = "${gameID}")
          LIMIT 1;
        `)
      .execute(this.databaseService.getClient())
    const nuuvemPrice = await sql
      .raw<GamePrice>(
        `SELECT * FROM game_price
          WHERE game_id = "${gameID}"
          AND nuuvem_price = (SELECT MIN(nuuvem_price) FROM game_price where game_id = "${gameID}")
          LIMIT 1;
        `)
      .execute(this.databaseService.getClient())

    const data: LowestPrice = {}
    if (steamPrice.rows.at(0) != null) data.steam = steamPrice.rows.at(0)
    if (nuuvemPrice.rows.at(0) != null) data.nuuvem = nuuvemPrice.rows.at(0)

    return data
  }
}
