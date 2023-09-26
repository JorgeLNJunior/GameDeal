export interface GamePriceScraperData {
  gameId: string
  steamUrl: string
  nuuvemUrl: string | null
  greenManGamingUrl: string | null
}

export enum QueueName {
  NOTICATION = 'NotificationQueue',
  GAME_PRICE_SCRAPING = 'GamePriceScrapingQueue'
}

export enum QueueJobName {
  NOTIFY_PRICE_DROP = 'NotifyPriceDrop',
  SCRAPE_GAME_PRICE = 'ScrapeGamePrice'
}
