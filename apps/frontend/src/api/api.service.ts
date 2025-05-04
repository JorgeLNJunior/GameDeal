import type { Game, GamePrice, GamePriceDrop, LowestPrice, QueryData } from '@packages/types'
import axios from 'axios'

import { API_SERVER_URL } from '@/constants/urls'

export class ApiService {
  private readonly http = axios.create({ baseURL: API_SERVER_URL })

  async getGames(title?: string, page = 1, limit = 20): Promise<QueryData<Game[]>> {
    let url = `/games?page=${page}&limit=${limit}`
    if (title != null) url += `&title=${title}`
    const response = await this.http.get(url)
    return response.data as QueryData<Game[]>
  }

  async getGameByID(gameID: string): Promise<Game> {
    const response = await this.http.get(`/games/${gameID}`)
    return response.data as Game
  }

  async getGamePrice(gameID: string): Promise<GamePrice> {
    const response = await this.http.get(`/games/${gameID}/current`)
    return response.data as GamePrice
  }

  async getGamePriceHistory(gameID: string, page = 1, limit = 15): Promise<QueryData<GamePrice[]>> {
    const response = await this.http.get(
      `/games/${gameID}/history?page=${page}&limit=${limit}&order=desc`
    )
    return response.data as QueryData<GamePrice[]>
  }

  async getLowestPrice(gameID: string): Promise<LowestPrice> {
    const response = await this.http.get(`/games/${gameID}/lowest`)
    return response.data as LowestPrice
  }

  async getTodayPriceDrops(limit = 19): Promise<QueryData<GamePriceDrop[]>> {
    const today = new Date().toISOString()
    const response = await this.http.get(`/drops?date=${today}&limit=${limit}`)
    return response.data as QueryData<GamePriceDrop[]>
  }

  async getGameCount(): Promise<number> {
    const response = await this.http.get('/games/count')
    return response.data.total as number
  }
}
