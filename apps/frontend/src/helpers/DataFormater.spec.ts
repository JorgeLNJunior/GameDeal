import { describe, expect, it } from 'vitest'

import { DataFormater } from './DataFormater'

describe('DataFormater', () => {
  it('should return a price with currency', async () => {
    const price = new DataFormater().formatPriceWithCurrency(150.99)
    expect(price).toBe('R$ 150,99')
  })

  it('should return return a date in "D MM de YYYY" format', async () => {
    const date = new DataFormater().formatFullDate(new Date('2022-10-15 13:05:20'))
    expect(date).toBe('15 Out de 2022')
  })

  it('should return return a date in "D/MMMM" format', async () => {
    const date = new DataFormater().formatShortDate(new Date('2022-02-21 13:05:20'))
    expect(date).toBe('21/Fev')
  })
})
