import { ColumnType, Generated } from 'kysely'

export interface Game {
  id: Generated<string>
  title: string
  steam_url: string
  nuuvem_url: string
  green_man_gaming_url: string
  created_at: ColumnType<Date, never, never>
  updated_at: ColumnType<Date, never, never>
}

export interface Database {
  game: Game
}
