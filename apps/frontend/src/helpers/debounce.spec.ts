import { wait } from '@packages/testing'
import { describe, expect, it, vi } from 'vitest'

import { debounce } from './debounce'

describe('Debounce', () => {
  it('should debounce a function execution', async () => {
    const dog = { bark: () => 'whoof' }
    const debouncedBark = debounce(() => dog.bark(), 500)

    const spy = vi.spyOn(dog, 'bark')

    // call more than one time
    debouncedBark()
    debouncedBark()

    await wait(600) // wait for debounced call

    expect(spy).toHaveBeenCalledOnce()
  })
})
