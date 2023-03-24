import { TelegramNotificator } from '@infra/notification/notificators/telegram.notificator'
import { Notificator } from '@localtypes/notificator.type'
import { PinoLogger } from '@modules/infra/pino.logger'
import { container } from 'tsyringe'

import { NOTIFICATORS, PINO_LOGGER } from './dependency.tokens'

container.register<PinoLogger>(PINO_LOGGER, PinoLogger)
container.register<Notificator[]>(NOTIFICATORS, {
  useValue: [container.resolve(TelegramNotificator)]
})
