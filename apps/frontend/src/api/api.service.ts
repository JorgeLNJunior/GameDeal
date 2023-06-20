import type { Game, GamePrice, QueryData } from '@shared/types'
import axios from 'axios'

import { SERVER_URL } from '@/constants/urls'

export class ApiService {
  private readonly http = axios.create({ baseURL: SERVER_URL })

  async getGames (page = 1, limit = 8): Promise<QueryData<Game[]>> {
    const response = await this.http.get(`/games?page=${page}&limit=${limit}`)
    return response.data as QueryData<Game[]>
  }

  async getGamePrice (gameID: string): Promise<GamePrice> {
    const response = await this.http.get(`/games/${gameID}/price`)
    return response.data as GamePrice
  }
}
