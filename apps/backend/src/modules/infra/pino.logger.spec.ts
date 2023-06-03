import { PinoLogger } from './pino.logger'

describe('PinoLogger', () => {
  const logger: PinoLogger = new PinoLogger()

  it('should log an info', async () => {
    const spy = jest.spyOn(logger, 'info')

    logger.info({}, 'info')

    expect(spy).toHaveBeenCalled()
  })

  it('should log a warn', async () => {
    const spy = jest.spyOn(logger, 'warn')

    logger.warn({}, 'warn')

    expect(spy).toHaveBeenCalled()
  })

  it('should log an error', async () => {
    const spy = jest.spyOn(logger, 'error')

    logger.error({}, 'error')

    expect(spy).toHaveBeenCalled()
  })

  it('should log a fatal', async () => {
    const spy = jest.spyOn(logger, 'fatal')

    logger.fatal({}, 'fatal')

    expect(spy).toHaveBeenCalled()
  })
})
