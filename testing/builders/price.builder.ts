/* eslint-disable @typescript-eslint/prefer-readonly */
import type { GamePrice } from '@localtypes/entities.type'
import { randomUUID } from 'crypto'

export class GamePriceBuilder {
  private id = randomUUID()
  private game_id: string = randomUUID()
  private steam_price = 50.99
  private nuuvem_price: number | null = 45.99
  private created_at = new Date('2022-10-21')
  private updated_at = null

  withGame (gameId: string): GamePriceBuilder {
    this.game_id = gameId
    return this
  }

  withNuuvemPrice (price: number | null): GamePriceBuilder {
    this.nuuvem_price = price
    return this
  }

  withSteamPrice (price: number): GamePriceBuilder {
    this.steam_price = price
    return this
  }

  build (): GamePrice {
    return {
      id: this.id,
      game_id: this.game_id,
      steam_price: this.steam_price,
      nuuvem_price: this.nuuvem_price,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}
