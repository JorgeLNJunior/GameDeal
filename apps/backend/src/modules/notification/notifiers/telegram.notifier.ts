import ConfigService from '@config/config.service'
import type { Notifier, NotifyNewGamesData, NotifyPriceDropData } from '@localtypes/notifier.type'
import { Telegraf } from 'telegraf'
import { singleton } from 'tsyringe'

@singleton()
export class TelegramNotifier implements Notifier {
  private bot!: Telegraf

  constructor (private readonly configService: ConfigService) { }

  async start (): Promise<void> {
    const BOT_TOKEN = this.configService.getEnv<string>('TELEGRAM_BOT_TOKEN')
    if (BOT_TOKEN === undefined) throw new Error('BOT_TOKEN is not defined')

    this.bot = new Telegraf(BOT_TOKEN)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.bot.launch()
  }

  async stop (): Promise<void> {
    this.bot.stop()
  }

  async notifyPriceDrop (data: NotifyPriceDropData): Promise<void> {
    const CHAT_ID = this.configService.getEnv<number>('TELEGRAM_CHAT_ID')
    if (CHAT_ID == null) {
      throw new Error('the environment variable "TELEGRAM_CHAT_ID" is not defined')
    }

    const formatedCurrentPrice = this.formatPriceToBRL(data.currentPrice)
    const formatedOldPrice = this.formatPriceToBRL(data.oldPrice)

    const escapedCurrentPrice = this.escapeSpecialChars(formatedCurrentPrice)
    const escapedOldPrice = this.escapeSpecialChars(formatedOldPrice)
    const escapedGameTitle = this.escapeSpecialChars(data.gameTitle)
    const escapedGameUrl = this.escapeSpecialChars(data.gameUrl)

    await this.bot.telegram.sendMessage(
      CHAT_ID,
      '⚠️ *Queda de preço* ⚠️ \n\n' +
      `🎮 *${escapedGameTitle} \\- ${data.store}* \n\n` +
      `💵 *Preço anterior:* ${escapedOldPrice} \n` +
      `💵 *Preço atual:* ${escapedCurrentPrice} \n\n` +
      `*Loja:* ${data.store} \n` +
      `🔗 ${escapedGameUrl}`,
      {
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: [[{ text: formatedCurrentPrice, url: data.gameUrl }]]
        }
      }
    )
  }

  async notifyNewGames (data: NotifyNewGamesData): Promise<void> {
    const CHAT_ID = this.configService.getEnv<number>('TELEGRAM_CHAT_ID')
    const WEB_APP_HOST = this.configService.getEnv<string>('WEB_APP_HOST')
    if (CHAT_ID == null) {
      throw new Error('the environment variable "TELEGRAM_CHAT_ID" is not defined')
    }
    if (WEB_APP_HOST == null) {
      throw new Error('the environment variable "WEB_APP_HOST" is not defined')
    }

    const message = this.escapeSpecialChars(`⚠️ ${data.count} novos jogos adicionados. ⚠️`)

    await this.bot.telegram.sendMessage(
      CHAT_ID,
      message,
      {
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: [[{ text: 'Todos os jogos', url: WEB_APP_HOST }]]
        }
      }
    )
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
  private escapeSpecialChars (text: string): string {
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
  private formatPriceToBRL (price?: number | null): string {
    if (price == null) return 'Não registrado'
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`
  }
}
