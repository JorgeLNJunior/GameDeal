import { MemoryCache } from '@api/internal/memory.cache'
import type { Notifier } from '@localtypes/notifier.type'
import { PinoLogger } from '@modules/infra/pino.logger'
import { TelegramNotifier } from '@notification/notifiers/telegram.notifier'
import { CheerioParser } from '@scrapers/parsers/cheerio.parser'
import { container } from 'tsyringe'

import {
  CHEERIO_PARSER,
  MEMORY_CACHE,
  NOTIFIERS,
  PINO_LOGGER
} from './dependency.tokens'

container.register<CheerioParser>(CHEERIO_PARSER, CheerioParser)
container.register<PinoLogger>(PINO_LOGGER, PinoLogger)
container.register<MemoryCache>(MEMORY_CACHE, MemoryCache)
container.register<Notifier[]>(NOTIFIERS, {
  useValue: [container.resolve(TelegramNotifier)]
})
