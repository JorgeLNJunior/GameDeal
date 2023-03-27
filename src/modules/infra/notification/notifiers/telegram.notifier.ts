import ConfigService from '@config/config.service'
import { Notifier, NotifyData } from '@localtypes/notifier.type'
import { Telegraf } from 'telegraf'
import { singleton } from 'tsyringe'

@singleton()
export class TelegramNotificator implements Notifier {
  private bot!: Telegraf

  constructor(private configService: ConfigService) {}

  async start(): Promise<void> {
    const BOT_TOKEN = this.configService.getEnv<string>('TELEGRAM_BOT_TOKEN')
    if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not defined')

    this.bot = new Telegraf(BOT_TOKEN)
    this.bot.launch()
  }

  async stop(): Promise<void> {
    this.bot.stop()
  }

  async notify(data: NotifyData): Promise<void> {
    const CHAT_ID = this.configService.getEnv<number>('TELEGRAM_CHAT_ID')
    if (!CHAT_ID) throw new Error('CHAT_ID is not defined')

    await this.bot.telegram.sendMessage(
      CHAT_ID,
      `
        ⚠️ Queda de preço no jogo: ${data.gameTitle} ⚠️

      Plataforma: ${data.platform}
      Preço atual: ${data.currentPrice}
      Preço anterior: ${data.oldPrice}

      Acesse: ${data.gameUrl}
      `.trim(),
      { parse_mode: 'Markdown' }
    )
  }
}
