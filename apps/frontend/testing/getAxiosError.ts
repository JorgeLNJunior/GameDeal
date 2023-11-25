import { AxiosError } from 'axios'

export function getAxiosError(status: number): AxiosError {
  return new AxiosError(undefined, undefined, undefined, undefined, {
    config: {} as any,
    data: {},
    headers: {},
    status,
    statusText: 'ERROR'
  })
}
