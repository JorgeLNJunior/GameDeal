export interface Game {
  id: string
  title: string
  steam_url: string
  nuuvem_url: string | null
  green_man_gaming_url: string | null
  created_at: Date
  updated_at: Date | null
}

export interface GamePrice {
  id: string
  game_id: string
  steam_price: number
  nuuvem_price: number | null
  green_man_gaming_price: number | null
  date: string
}

export interface GamePriceDrop {
  /** The ID of the GamePriceDrop object. */
  id: string
  /** The ID of the game. */
  game_id: string
  /** The store with the lowest price. */
  store: Store
  /** The previous registered price. */
  previous_price: number | null
  /** The current price with discount. */
  discount_price: number
  /** The date of the discount. */
  date: string
}

export type Store = 'Steam' | 'Nuuvem' | 'Green Man Gaming'

export interface GameIgnoreList {
  id: string
  title: string
}

export interface LowestPrice {
  steam: { price: number | null, date: string | null }
  nuuvem: { price: number | null, date: string | null }
  green_man_gaming: { price: number | null, date: string | null }
}

export interface QueryData<T> {
  results: T
  count: number
  page: number
  totalPages: number
}
