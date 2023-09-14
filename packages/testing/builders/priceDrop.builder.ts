/* eslint-disable @typescript-eslint/prefer-readonly */
import type { GamePriceDrop } from '@packages/types'
import { randomUUID } from 'crypto'

export class GamePriceDropBuilder {
  private id = randomUUID()
  private game_id: string = randomUUID()
  private discount_price = 50.99
  private old_price = 50.99
  private platform: Platform = 'Steam'
  private date = new Date('2022-10-21').toISOString()

  withGame (gameId: string): GamePriceDropBuilder {
    this.game_id = gameId
    return this
  }

  withDiscountPrice (price: number): GamePriceDropBuilder {
    this.discount_price = price
    return this
  }

  withOldPrice (price: number): GamePriceDropBuilder {
    this.old_price = price
    return this
  }

  withPlatform (platform: Platform): GamePriceDropBuilder {
    this.platform = platform
    return this
  }

  build (): GamePriceDrop {
    return {
      id: this.id,
      game_id: this.game_id,
      discount_price: this.discount_price,
      old_price: this.old_price,
      platform: this.platform,
      date: this.date
    }
  }
}

type Platform = 'Steam' | 'Nuuvem' | 'Green Man Gaming'
