import ConfigService from '@config/config.service'
import { AxiosService } from '@infra/axios.service'
import type { Notifier, NotifyNewGamesData, NotifyPriceDropData } from '@localtypes/notifier.type'
import { singleton } from 'tsyringe'

@singleton()
export class TelegramNotifier implements Notifier {
  constructor(
    private readonly axios: AxiosService,
    private readonly configService: ConfigService
  ) { }

  async notifyPriceDrop(data: NotifyPriceDropData): Promise<void> {
    const CHAT_ID = this.configService.getEnv<number>('TELEGRAM_CHAT_ID')
    if (CHAT_ID == null) {
      throw new Error('the environment variable "TELEGRAM_CHAT_ID" is not defined')
    }

    const BOT_TOKEN = this.configService.getEnv<string>('TELEGRAM_BOT_TOKEN')
    if (BOT_TOKEN === undefined) throw new Error('BOT_TOKEN is not defined')

    const formatedCurrentPrice = this.formatPriceToBRL(data.currentPrice)
    const formatedOldPrice = this.formatPriceToBRL(data.oldPrice)

    const escapedCurrentPrice = this.escapeSpecialChars(formatedCurrentPrice)
    const escapedOldPrice = this.escapeSpecialChars(formatedOldPrice)
    const escapedGameTitle = this.escapeSpecialChars(data.gameTitle)
    const escapedGameUrl = this.escapeSpecialChars(data.gameUrl)

    const message = '⚠️ *Queda de preço* ⚠️ \n\n' +
      `🎮 *${escapedGameTitle} \\- ${data.store}* \n\n` +
      `💵 *Preço anterior:* ${escapedOldPrice} \n` +
      `💵 *Preço atual:* ${escapedCurrentPrice} \n\n` +
      `*Loja:* ${data.store} \n` +
      `🔗 ${escapedGameUrl}`

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    const body = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [[{ text: formatedCurrentPrice, url: data.gameUrl }]]
      }
    }

    const response = await this.axios.post<TelegramAPIResponse>(url, body)
    if (!response.ok) {
      throw new Error(response.description ?? 'Unknown error sending a message to Telegram')
    }
  }

  async notifyNewGames(data: NotifyNewGamesData): Promise<void> {
    const CHAT_ID = this.configService.getEnv<number>('TELEGRAM_CHAT_ID')
    if (CHAT_ID == null) throw new Error('the environment variable "TELEGRAM_CHAT_ID" is not defined')

    const WEB_APP_HOST = this.configService.getEnv<string>('WEB_APP_HOST')
    if (WEB_APP_HOST == null) throw new Error('the environment variable "WEB_APP_HOST" is not defined')

    const BOT_TOKEN = this.configService.getEnv<string>('TELEGRAM_BOT_TOKEN')
    if (BOT_TOKEN === undefined) throw new Error('BOT_TOKEN is not defined')

    const message = this.escapeSpecialChars(`⚠️ ${data.count} novos jogos adicionados. ⚠️`)
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    const body = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [[{ text: 'Todos os jogos', url: WEB_APP_HOST }]]
      }
    }

    const response = await this.axios.post<TelegramAPIResponse>(url, body)
    if (!response.ok) {
      throw new Error(response.description ?? 'Unknown error sending a message to Telegram')
    }
  }

  /**
   * Escape some special characteres in a text.
   * It's necessary due markdown sintax conflicts.
   *
   * @example
   * ```
   * const escaped = this.escapeSpecialChars(text)
   * ```
   *
   * @param text - The text to escape.
   */
  private escapeSpecialChars(text: string): string {
    return text
      .replaceAll('.', '\\.')
      .replaceAll(',', '\\,')
      .replaceAll('_', '\\_')
      .replaceAll('-', '\\-')
      .replaceAll('*', '\\*')
      .replaceAll('+', '\\+')
      .replaceAll('=', '\\=')
      .replaceAll('|', '\\|')
      .replaceAll('!', '\\!')
      .replaceAll(']', '\\]')
      .replaceAll('[', '\\[')
      .replaceAll('{', '\\{')
      .replaceAll('}', '\\}')
      .replaceAll('(', '\\(')
      .replaceAll(')', '\\)')
  }

  /**
   * Format a number to BRL currency.
   *
   * @example
   * ```
   * const brl = this.formatPriceToBRL(50.95) // R$ 50,95
   * ```
   *
   * @param price - The price to be converted.
   */
  private formatPriceToBRL(price?: number | null): string {
    if (price == null) return 'Não registrado'
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`
  }
}

interface TelegramAPIResponse {
  ok: boolean
  description?: string
}
