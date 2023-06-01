import { type ColumnType } from 'kysely'

export interface GameTable {
  id: ColumnType<string, string, never>
  title: string
  steam_url: string
  nuuvem_url: string | null
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, never>
}

export interface GamePriceTable {
  id: ColumnType<string, string, never>
  game_id: ColumnType<string, string, never>
  steam_price: number
  nuuvem_price: number | null
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, never>
}

export interface Database {
  game: GameTable
  game_price: GamePriceTable
}
