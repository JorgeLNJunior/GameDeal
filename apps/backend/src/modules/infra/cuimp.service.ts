import { createCuimpHttp, CuimpHttp } from 'cuimp'
import { injectable } from 'tsyringe'

import { createError, HttpService, RequestConfig } from './http.service'
import { PinoLogger } from './pino.logger'

@injectable()
export class CuimpService implements HttpService {
  private client: CuimpHttp

  constructor(private readonly logger: PinoLogger) {
    this.client = createCuimpHttp({
      descriptor: {
        browser: 'firefox'
      },
    })
  }

  async get<Response>(url: string, config?: RequestConfig): Promise<Response> {
    const response = await this.client.get(url, {
      headers: {
        ...config?.headers
      }
    })
    if (response.status >= 400) {
      throw createError(response.status, url)
    }
    return response.rawBody.toString() as Response
  }

  async post<Response>(url: string, body?: object, config?: RequestConfig): Promise<Response> {
    const response = await this.client.post(url, { ...body }, {
      headers: {
        ...config?.headers
      }
    })
    if (response.status >= 400) {
      throw createError(response.status, url)
    }
    return response.rawBody.toString() as Response
  }
}
