/* eslint-disable @typescript-eslint/prefer-readonly */
import { type HttpRequest } from '@localtypes/http/http.type'

export class HttpRequestBuilder {
  private query: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private body: any
  private headers: Record<string, string>
  private params: Record<string, string>
  private url: string

  constructor () {
    this.query = {}
    this.body = undefined
    this.headers = {}
    this.params = {}
    this.url = '/status'
  }

  withBody (body: unknown): HttpRequestBuilder {
    this.body = body
    return this
  }

  withHeaders (headers: Record<string, string>): HttpRequestBuilder {
    this.headers = headers
    return this
  }

  withParams (params: Record<string, string>): HttpRequestBuilder {
    this.params = params
    return this
  }

  build (): HttpRequest {
    return {
      body: this.body,
      query: this.query,
      headers: this.headers,
      params: this.params,
      url: this.url
    }
  }
}
