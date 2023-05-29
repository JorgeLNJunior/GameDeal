/* eslint-disable @typescript-eslint/prefer-readonly */
import type { Game } from '@localtypes/entities.type'
import { randomUUID } from 'crypto'

export class GameBuilder {
  private readonly id = randomUUID()
  private title = 'God of War'
  private steam_url = 'https://store.steampowered.com/app/1593500/God_of_War'
  private nuuvem_url = 'https://www.nuuvem.com/br-en/item/god-of-war'
  private created_at = new Date('2019-05-12')
  private updated_at = null

  build (): Game {
    return {
      id: this.id,
      title: this.title,
      steam_url: this.steam_url,
      nuuvem_url: this.nuuvem_url,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}
