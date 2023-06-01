import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { type Notifier, type NotifyData } from '@localtypes/notifier.type'
import { Telegraf } from 'telegraf'
import { inject, singleton } from 'tsyringe'

@singleton()
export class TelegramNotifier implements Notifier {
  private bot!: Telegraf

  constructor (
    private readonly configService: ConfigService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

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

  async notify (data: NotifyData): Promise<void> {
    const CHAT_ID = this.configService.getEnv<number>('TELEGRAM_CHAT_ID')
    if (CHAT_ID === undefined) throw new Error('CHAT_ID is not defined')

    await this.bot.telegram.sendMessage(
      CHAT_ID,
      '⚠️ *Queda de preço* ⚠️ \n\n' +
        `🎮 *${data.gameTitle} - ${data.platform}* \n\n` +
        `💵 *Preço anterior:* R$ ${data.oldPrice} \n` +
        `💵 *Preço atual:* R$ ${data.currentPrice} \n\n` +
        `*Loja:* ${data.platform} \n` +
        `🔗 ${data.gameUrl}`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: `R$ ${data.currentPrice}`, url: data.gameUrl }]]
        }
      }
    )
  }
}
