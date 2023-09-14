/* eslint-disable @typescript-eslint/prefer-readonly */
import type { GamePrice } from '@packages/types'
import { randomUUID } from 'crypto'

export class GamePriceBuilder {
  private id = randomUUID()
  private game_id: string = randomUUID()
  private steam_price = 50.99
  private nuuvem_price: number | null = 45.99
  private green_man_gaming_price: number | null = 50.45
  private date = '2022-10-21'

  withGame (gameId: string): GamePriceBuilder {
    this.game_id = gameId
    return this
  }

  withGreenManGamingPrice (price: number | null): GamePriceBuilder {
    this.green_man_gaming_price = price
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
      green_man_gaming_price: this.green_man_gaming_price,
      date: this.date
    }
  }
}
