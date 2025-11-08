import { AxiosError } from "axios";

export function getAxiosError(status: number): AxiosError {
  return new AxiosError(undefined, undefined, undefined, undefined, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: {} as any,
    data: {},
    headers: {},
    status,
    statusText: "ERROR",
  });
}
