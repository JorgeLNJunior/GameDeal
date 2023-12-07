import { type Store } from '@packages/types'
import { type ColumnType } from 'kysely'

interface GameTable {
  id: ColumnType<string, string, never>
  title: string
  steam_url: string
  nuuvem_url: string | null
  green_man_gaming_url: string | null
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, never>
}

interface GamePriceTable {
  id: ColumnType<string, string, never>
  game_id: ColumnType<string, string, never>
  steam_price: number
  nuuvem_price: number | null
  green_man_gaming_price: number | null
  date: ColumnType<string, never, never>
}

interface GamePriceDropTable {
  id: ColumnType<string, string, never>
  game_id: ColumnType<string, string, never>
  store: Store
  previous_price: number | null
  discount_price: number
  date: ColumnType<string, never, never>
}

interface GameIgnoreListTable {
  id: ColumnType<string, string, never>
  title: string
}

export interface Database {
  game: GameTable
  game_price: GamePriceTable
  game_price_drop: GamePriceDropTable
  game_ignore_list: GameIgnoreListTable
}
