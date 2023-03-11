import { PinoLogger } from '@modules/infra/pino.logger'
import { container } from 'tsyringe'

import { PINO_LOGGER } from './dependency.tokens'

container.register<PinoLogger>(PINO_LOGGER, PinoLogger)
