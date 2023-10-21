export interface GamePriceScraperData {
  gameId: string
  steamUrl: string
  nuuvemUrl: string | null
  greenManGamingUrl: string | null
}

export interface GameDiscoveryScraperData {
  id: string
  title: string
}

export enum QueueName {
  GAME_DISCOVERY = 'GameDiscovery',
  GAME_PRICE_SCRAPING = 'GamePriceScrapingQueue',
  NOTICATION = 'NotificationQueue'
}

export enum QueueJobName {
  NOTIFY_PRICE_DROP = 'NotifyPriceDrop',
  SCRAPE_GAME_PRICE = 'ScrapeGamePrice',
  GREEN_MAN_GAMING_GAME_DISCOVERY = 'GmgGameDiscovery',
  NUUVEM_GAME_DISCOVERY = 'NuuvemGameDiscovery',
  STEAM_GAME_DISCOVERY = 'SteamGameDiscovery'
}
