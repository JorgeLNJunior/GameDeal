import { MemoryCache } from './memory.cache'

describe('MemoryCache', () => {
  let cache: MemoryCache

  beforeEach(async () => {
    cache = new MemoryCache()
  })

  it('should set a cache value', async () => {
    const key = 'game'
    const data = { game: 'God of War' }

    await cache.set(key, data)
    const cacheData = await cache.get(key)

    expect(cacheData?.value).toEqual(data)
  })
})
