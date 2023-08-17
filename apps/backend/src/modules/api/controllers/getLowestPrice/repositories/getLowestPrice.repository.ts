import { DatabaseService } from '@database/database.service'
import type { LowestPrice } from '@packages/types'
import { sql } from 'kysely'
import { injectable } from 'tsyringe'

@injectable()
export class GetLowestPriceRepository {
  constructor (private readonly databaseService: DatabaseService) {}

  /**
   * Returns the lowest price of a game from each platform.
   *
   * @example
   * ```
   * const prices = await getLowestPriceRepository.get(gameID)
   * ```
   *
   * @param gameID - The ID of the game.
   */
  async get (gameID: string): Promise<LowestPrice> {
    const steamPrice = await sql
      .raw<LowestPriceResult | null>(
        `SELECT steam_price as price, created_at as date FROM game_price
          WHERE game_id = "${gameID}"
          AND steam_price = (SELECT MIN(steam_price) FROM game_price where game_id = "${gameID}")
          LIMIT 1;
        `)
      .execute(this.databaseService.getClient())
    const nuuvemPrice = await sql
      .raw<LowestPriceResult | null>(
        `SELECT nuuvem_price as price, created_at as date FROM game_price
          WHERE game_id = "${gameID}"
          AND nuuvem_price = (SELECT MIN(nuuvem_price) FROM game_price where game_id = "${gameID}")
          LIMIT 1;
        `)
      .execute(this.databaseService.getClient())
    const gmgPrice = await sql
      .raw<LowestPriceResult | null>(
        `SELECT green_man_gaming_price as price, created_at as date FROM game_price
          WHERE game_id = "${gameID}"
          AND nuuvem_price = (SELECT MIN(nuuvem_price) FROM game_price where game_id = "${gameID}")
          LIMIT 1;
        `)
      .execute(this.databaseService.getClient())

    const data: LowestPrice = {
      steam: {
        price: steamPrice.rows.at(0)?.price ?? null,
        date: steamPrice.rows.at(0)?.date ?? null
      },
      nuuvem: {
        price: nuuvemPrice.rows.at(0)?.price ?? null,
        date: nuuvemPrice.rows.at(0)?.date ?? null
      },
      green_man_gaming: {
        price: gmgPrice.rows.at(0)?.price ?? null,
        date: gmgPrice.rows.at(0)?.date ?? null
      }
    }

    return data
  }
}

interface LowestPriceResult {
  price: number
  date: string
}
