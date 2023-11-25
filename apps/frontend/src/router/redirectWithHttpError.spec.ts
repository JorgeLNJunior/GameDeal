import { afterEach, describe, expect, it, vi } from 'vitest'

import router from '@/router'
import { HttpErrorType } from '@/types/httpError.type'

import { getAxiosError } from '../../testing/getAxiosError'
import { redirectWithHttpError } from './redirectWithHttpError'

describe('redirectWithHttpError', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect with NOT_FOUND error', async () => {
    const routerSpy = vi.spyOn(router, 'push').mockResolvedValueOnce()
    const error = getAxiosError(404)

    await redirectWithHttpError(router, error)

    expect(routerSpy).toHaveBeenCalledOnce()
    expect(routerSpy).toHaveBeenCalledWith({
      path: '/error',
      query: { error: HttpErrorType.NOT_FOUND }
    })
  })

  it('should redirect with TOO_MANY_REQUESTS error', async () => {
    const routerSpy = vi.spyOn(router, 'push').mockResolvedValueOnce()
    const error = getAxiosError(429)

    await redirectWithHttpError(router, error)

    expect(routerSpy).toHaveBeenCalledOnce()
    expect(routerSpy).toHaveBeenCalledWith({
      path: '/error',
      query: { error: HttpErrorType.TOO_MANY_REQUESTS }
    })
  })

  it('should redirect with INTERNAL_ERROR error', async () => {
    const routerSpy = vi.spyOn(router, 'push').mockResolvedValueOnce()
    const error = getAxiosError(500)

    await redirectWithHttpError(router, error)

    expect(routerSpy).toHaveBeenCalledOnce()
    expect(routerSpy).toHaveBeenCalledWith({
      path: '/error',
      query: { error: HttpErrorType.INTERNAL }
    })
  })
})
