import { isAxiosError } from 'axios'
import type { Router } from 'vue-router'

import { HttpErrorType } from '@/types/httpError.type'

export async function redirectWithHttpError (router: Router, error: unknown): Promise<void> {
  if (isAxiosError(error)) {
    if (error.response?.status === 404) {
      await router.push({
        path: '/error',
        query: { error: HttpErrorType.NOT_FOUND }
      }); return
    }
    if (error.response?.status === 429) {
      await router.push({
        path: '/error',
        query: { error: HttpErrorType.TOO_MANY_REQUESTS }
      }); return
    }
    if (error.response?.status === 500) {
      await router.push({
        path: '/error',
        query: { error: HttpErrorType.INTERNAL }
      }); return
    }
  }
  await router.push('/error')
}
