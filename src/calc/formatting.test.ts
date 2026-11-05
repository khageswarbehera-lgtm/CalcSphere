import { describe, expect, it } from 'vitest'

import { formatCompact, formatNumber, moneyFormat } from './formatting'

describe('formatting', () => {
  it('moneyFormat formats INR without decimals', () => {
    expect(moneyFormat(10258.26)).toBe('₹10,258')
  })

  it('formatNumber respects options', () => {
    expect(formatNumber(1234.5, { minimumFractionDigits: 2 })).toContain('1,234.50')
  })

  it('formatCompact', () => {
    expect(formatCompact(1500)).toBe('1.5K')
  })
})