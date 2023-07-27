import type { Game, GamePrice, LowestPrice, QueryData } from '@packages/types'
import axios from 'axios'

import { SERVER_URL } from '@/constants/urls'
import router from '@/router'

export class ApiService {
  private readonly http = axios.create({ baseURL: SERVER_URL })

  constructor () {
    this.http.interceptors.response.use(undefined, async (error) => {
      if (error.response.status === 404) return await router.push({ name: 'notFound' })
    })
  }

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

  async getGamePriceHistory (gameID: string, page = 1, limit = 10): Promise<QueryData<GamePrice[]>> {
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
