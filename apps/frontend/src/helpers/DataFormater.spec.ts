import { describe, expect, it } from 'vitest'

import { DataFormater } from './DataFormater'

describe('DataFormater', () => {
  it('should return a price with currency', async () => {
    const price = new DataFormater().formatPriceWithCurrency(150.99)
    expect(price).toBe('R$ 150,99')
  })

  it('should return return a date in dd/mm/yy format', async () => {
    const date = new DataFormater().formatDate(new Date('2022-10-15 13:05:20'))
    expect(date).toBe('15/10/2022')
  })
})
