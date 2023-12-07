import axios, { type AxiosInstance, isAxiosError } from 'axios'
import { injectable } from 'tsyringe'

import { PinoLogger } from './pino.logger'

@injectable()
export class AxiosService {
  private readonly axiosInstance: AxiosInstance

  constructor (private readonly logger: PinoLogger) {
    this.axiosInstance = axios.create()
    this.axiosInstance.interceptors.response.use(undefined, (error) => {
      if (isAxiosError(error)) {
        this.logger.error(
          error,
          `[AxiosService] request to "${error.config?.url ?? 'unknown'}" failed with code "${error.code ?? 'unknown'}"`)
      } else this.logger.error(error, '[AxiosService] request failed')
      throw error
    })
  }

  async get <Response>(url: string, config?: RequestConfig): Promise<Response> {
    const response = await this.axiosInstance.get(url, config)
    return response.data
  }

  async post <Response>(url: string, body?: unknown, config?: RequestConfig): Promise<Response> {
    const response = await this.axiosInstance.post(url, body, config)
    return response.data
  }
}

interface RequestConfig {
  headers: Record<string, string>
}
