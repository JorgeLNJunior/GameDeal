import type { Game, GamePrice, LowestPrice, QueryData } from '@packages/types'
import axios from 'axios'

import { SERVER_URL } from '@/constants/urls'

export class ApiService {
  private readonly http = axios.create({ baseURL: SERVER_URL })

  async getGames (title?: string, page = 1, limit = 8): Promise<QueryData<Game[]>> {
    let url = `/games?page=${page}&limit=${limit}`
    if (title != null) url += `&title=${title}`
    const response = await this.http.get(url)
    return response.data as QueryData<Game[]>
  }

  async getGameByID (gameID: string): Promise<Game> {
    const response = await this.http.get(`/games/${gameID}`)
    return response.data as Game
  }

  async getGamePrice (gameID: string): Promise<GamePrice> {
    const response = await this.http.get(`/games/${gameID}/price`)
    return response.data as GamePrice
  }

  async getGamePriceHistory (gameID: string, page = 1, limit = 15): Promise<QueryData<GamePrice[]>> {
    const response = await this.http.get(
      `/games/${gameID}/price/history?page=${page}&limit=${limit}&order=desc`
    )
    return response.data as QueryData<GamePrice[]>
  }

  async getLowestPrice (gameID: string): Promise<LowestPrice> {
    const response = await this.http.get(`/games/${gameID}/price/lowest`)
    return response.data as LowestPrice
  }
}
