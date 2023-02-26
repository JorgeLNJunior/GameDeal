import { ColumnType } from 'kysely'

export interface Game {
  id: ColumnType<string, string, never>
  title: string
  steam_url: string
  nuuvem_url: string | null
  green_man_gaming_url: string | null
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, never>
}

export interface GamePrice {
  id: ColumnType<string, string, never>
  game_id: ColumnType<string, string, never>
  steam_price: number
  nuuvem_price: number | null
  green_man_gaming_price: number | null
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, never>
}

export interface Database {
  game: Game
  game_price: GamePrice
}
