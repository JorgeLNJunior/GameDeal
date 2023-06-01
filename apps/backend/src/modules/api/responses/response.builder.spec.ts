import { ResponseBuilder } from './response.builder'

describe('ResponseBuilder', () => {
  it('should return a OK response', () => {
    const response = ResponseBuilder.ok({ foo: 'bar' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ foo: 'bar' })
  })

  it('should return a CREATED response', () => {
    const response = ResponseBuilder.created({ foo: 'bar' })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ foo: 'bar' })
  })

  it('should return a BAD_REQUEST response', () => {
    const messages = [{ message: 'foo' }, { message: 'bar' }]
    const response = ResponseBuilder.badRequest(messages)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: 'Bad Request',
      messages
    })
  })

  it('should return a UNAUTHORIZED response', () => {
    const response = ResponseBuilder.unauthorized('foo')

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ error: 'Unauthorized', message: 'foo' })
  })

  it('should return a FORBIDEN response', () => {
    const response = ResponseBuilder.forbidden('foo')

    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual({ error: 'Forbidden', message: 'foo' })
  })

  it('should return a NOT_FOUND response', () => {
    const response = ResponseBuilder.notFound('foo')

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ error: 'Not Found', message: 'foo' })
  })

  it('should return a INTERNAL_ERROR response', () => {
    const response = ResponseBuilder.internalError()

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: 'Internal Error',
      message: 'internal server error'
    })
  })
})
