export interface ScrapeGamePriceData {
  gameId: string
  steamUrl: string
  nuuvemUrl: string | null
  green_man_gaming_url: string | null
}

export enum QueueName {
  NOTICATION = 'NotificationQueue',
  GAME_SCRAPING = 'GameScrapingQueue'
}

export enum QueueJobName {
  NOTIFY_PRICE_DROP = 'NotifyPriceDrop',
  SCRAPE_GAME_PRICE = 'ScrapeGamePrice'
}
