import { TelegramNotificator } from '@infra/notification/notifiers/telegram.notifier'
import { Notifier } from '@localtypes/notifier.type'
import { PinoLogger } from '@modules/infra/pino.logger'
import { container } from 'tsyringe'

import { NOTIFIERS, PINO_LOGGER } from './dependency.tokens'

container.register<PinoLogger>(PINO_LOGGER, PinoLogger)
container.register<Notifier[]>(NOTIFIERS, {
  useValue: [container.resolve(TelegramNotificator)]
})
