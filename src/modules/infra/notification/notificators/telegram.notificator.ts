import ConfigService from '@config/config.service'
import { Notificator } from '@localtypes/notificator.type'
import { Telegraf } from 'telegraf'
import { singleton } from 'tsyringe'

@singleton()
export class TelegramNotificator implements Notificator {
  private bot!: Telegraf

  constructor(private configService: ConfigService) {}

  async notify(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async start(): Promise<void> {
    const BOT_TOKEN = this.configService.getEnv<string>('TELEGRAM_BOT_TOKEN')
    if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not defined')

    this.bot = new Telegraf(BOT_TOKEN)
    this.registerCommands()
    this.bot.launch()
  }

  stop(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  private registerCommands(): void {
    this.bot.start(async (ctx) => await ctx.reply('Hello!'))
  }
}
