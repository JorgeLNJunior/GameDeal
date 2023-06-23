export interface GetGamePriceHistoryQuery {
  startDate?: Date
  endDate?: Date
  page?: string
  limit?: string
  order?: 'asc' | 'desc'
}
