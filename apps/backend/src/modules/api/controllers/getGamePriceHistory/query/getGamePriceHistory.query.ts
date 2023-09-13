export interface GetGamePriceHistoryQuery {
  startDate?: string
  endDate?: string
  page?: string
  limit?: string
  order?: 'asc' | 'desc'
}
