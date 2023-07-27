type TimerHandle = ReturnType<typeof setTimeout>

export function debounce<T extends (...args: unknown[]) => unknown> (
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: TimerHandle | null

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timer as TimerHandle)
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}
