import { AxiosService } from "./axios.service"
import { PinoLogger } from "./pino.logger"

describe('AxiosService', () => {
  let axios: AxiosService
  let logger: PinoLogger
  const url = 'https://api.gamedeal.cloudns.nz'

  beforeEach(async () => {
    logger = new PinoLogger()
    axios = new AxiosService(logger)
  })

  it('should make a GET http request', async () => {
    const data = await axios.get<string>(`${url}/games`)
    expect(data).toBeDefined()
  })

  it.failing('should log if a request fail', async () => {
    const loggerSpy = jest.spyOn(logger, 'error')
    await axios.get(`${url}/404`)
    expect(loggerSpy).toHaveBeenCalled()
  })
})
