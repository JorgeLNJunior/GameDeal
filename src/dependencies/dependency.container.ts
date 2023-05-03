import { TelegramNotifier } from '@infra/notification/notifiers/telegram.notifier'
import { Notifier } from '@localtypes/notifier.type'
import { PinoLogger } from '@modules/infra/pino.logger'
import { CheerioParser } from '@scrapers/parsers/cheerio.parser'
import { container } from 'tsyringe'

import { CHEERIO_PARSER, NOTIFIERS, PINO_LOGGER } from './dependency.tokens'

container.register<CheerioParser>(CHEERIO_PARSER, CheerioParser)
container.register<PinoLogger>(PINO_LOGGER, PinoLogger)
container.register<Notifier[]>(NOTIFIERS, {
  useValue: [container.resolve(TelegramNotifier)]
})
