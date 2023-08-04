export interface HttpRequest {
  query: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
  headers: Record<string, string>
  params: Record<string, string>
  url: string
}

export interface HttpResponse {
  statusCode: number
  body: unknown
  headers?: Record<string, unknown>
}

export interface HttpRedirect {
  statusCode: number
  to: string
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  HEAD = 'HEAD'
}
