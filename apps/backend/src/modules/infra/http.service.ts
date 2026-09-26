export interface HttpService {
  get<Response>(url: string, config?: RequestConfig): Promise<Response>

  post<Response>(url: string, body?: unknown, config?: RequestConfig): Promise<Response>
}

export interface RequestConfig {
  headers: Record<string, string>
}

export function createError(status: number, url: string): Error {
  if (status === 401) {
    return new Error('unauthenticated: ' + url)
  }
  if (status === 403) {
    return new Error('forbiden: ' + url)
  }
  if (status === 404) {
    return new Error('url not found: ' + url)
  }
  if (status === 409) {
    return new Error('too many requests to: ' + url)
  }
  if (status === 500) {
    return new Error('server error: ' + url)
  }
  if (status === 502) {
    return new Error('unavailable: ' + url)
  }
  return new Error('unexpected status code: ' + status + ' url: ' + url)
}
