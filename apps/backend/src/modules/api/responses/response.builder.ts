import type { HttpResponse } from '@localtypes/http/http.type'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ResponseBuilder {
  /**
   * Build a HTTP 200 response.
   * @example
   * ```
   * return ResponseBuilder.ok(data)
   * ```
   * @param data - The data to be returned.
   * @returns A `HttpResponse`.
   */
  static ok (data?: unknown): HttpResponse {
    return { statusCode: 200, body: data }
  }

  /**
   * Build a HTTP 201 response.
   * @example
   * ```
   * return ResponseBuilder.created(data)
   * ```
   * @param data - The data to be returned.
   * @returns A `HttpResponse`.
   */
  static created (data?: unknown): HttpResponse {
    return { statusCode: 201, body: data }
  }

  /**
   * Build a HTTP 304 response.
   * @example
   * ```
   * return ResponseBuilder.notModified(data, headers)
   * ```
   * @param data - The data to be returned.
   * @param headers - The headers to be returned.
   * @returns A `HttpResponse`.
   */
  static notModified (
    data?: unknown,
    headers?: Record<string, string>
  ): HttpResponse {
    return { statusCode: 200, body: data, headers }
  }

  /**
   * Build a HTTP 400 response.
   * @example
   * ```
   * return ResponseBuilder.badRequest(data)
   * ```
   * @param errors - A list of errors to be returned.
   * @returns A `HttpResponse`.
   */
  static badRequest (errors?: unknown): HttpResponse {
    return {
      statusCode: 400,
      body: {
        error: 'Bad Request',
        messages: errors
      }
    }
  }

  /**
   * Build a HTTP 401 response.
   * @example
   * ```
   * return ResponseBuilder.ok(data)
   * ```
   * @param error - An error to be returned.
   * @returns A `HttpResponse`.
   */
  static unauthorized (error?: unknown): HttpResponse {
    return {
      statusCode: 401,
      body: {
        error: 'Unauthorized',
        message: error
      }
    }
  }

  /**
   * Build a HTTP 403 response.
   * @example
   * ```
   * return ResponseBuilder.forbidden(data)
   * ```
   * @param error - An error to be returned.
   * @returns A `HttpResponse`.
   */
  static forbidden (error?: unknown): HttpResponse {
    return {
      statusCode: 403,
      body: {
        error: 'Forbidden',
        message: error
      }
    }
  }

  /**
   * Build a HTTP 404 response.
   * @example
   * ```
   * return ResponseBuilder.notFound(data)
   * ```
   * @param error - An error to be returned.
   * @returns A `HttpResponse`.
   */
  static notFound (error?: unknown): HttpResponse {
    return {
      statusCode: 404,
      body: {
        error: 'Not Found',
        message: error
      }
    }
  }

  /**
   * Build a HTTP 500 response.
   * @example
   * ```
   * return ResponseBuilder.internalError()
   * ```
   * @returns A `HttpResponse`.
   */
  static internalError (): HttpResponse {
    return {
      statusCode: 500,
      body: {
        error: 'Internal Error',
        message: 'internal server error'
      }
    }
  }
}
