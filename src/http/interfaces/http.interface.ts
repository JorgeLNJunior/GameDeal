export interface HttpRequest {
  query: Record<string, string>
  body: unknown
  headers: Record<string, string>
  params: Record<string, string>
}

export interface HttpResponse {
  statusCode: number
  body: unknown
}
