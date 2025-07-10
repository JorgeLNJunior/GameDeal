 
import type { Game } from '@packages/types'
import { randomUUID } from 'crypto'

export class GameBuilder {
  private readonly id = randomUUID()
  private title = 'God of War'
  private steam_url = 'https://store.steampowered.com/app/1593500/God_of_War'
  private nuuvem_url: string | null = 'https://www.nuuvem.com/br-en/item/god-of-war'
  private green_man_gaming_url: string | null = 'https://www.greenmangaming.com/games/god-of-war-pc'
  private created_at = new Date('2019-05-12')
  private updated_at = null

  withTitle (title: string): GameBuilder {
    this.title = title
    return this
  }

  withGreenManGamingUrl (url: string | null): GameBuilder {
    this.green_man_gaming_url = url
    return this
  }

  withNuuvemUrl (url: string | null): GameBuilder {
    this.nuuvem_url = url
    return this
  }

  build (): Game {
    return {
      id: this.id,
      title: this.title,
      steam_url: this.steam_url,
      nuuvem_url: this.nuuvem_url,
      green_man_gaming_url: this.green_man_gaming_url,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}
