export interface HttpRequest {
  query: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
  headers: Record<string, string>
  params: Record<string, string>
}

export interface HttpResponse {
  statusCode: number
  body: unknown
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  HEAD = 'HEAD'
}
