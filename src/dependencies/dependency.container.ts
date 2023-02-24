import { container } from 'tsyringe'

import { PinoLogger } from '../modules/infra/pino.logger'
import { PINO_LOGGER } from './dependency.tokens'

container.register<PinoLogger>(PINO_LOGGER, PinoLogger)
