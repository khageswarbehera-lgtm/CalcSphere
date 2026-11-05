import { describe, expect, it } from 'vitest'

import {
  applyDiscounts,
  discountAmount,
  gstExclusive,
  gstInclusive,
  loss,
  lossPercent,
  markedPrice,
  priceAfterDiscount,
  profit,
  profitPercent,
  sellingPrice,
} from './commerce'
import { CalculationError } from './errors'

describe('commerce', () => {
  it('profit and loss', () => {
    expect(profit(100, 120)).toBe(20)
    expect(loss(120, 100)).toBe(20)
  })

  it('profit/loss percent', () => {
    expect(profitPercent(100, 120)).toBe(20)
    expect(lossPercent(100, 80)).toBe(20)
    expect(() => profitPercent(0, 100)).toThrow(CalculationError)
  })

  it('selling/marked price', () => {
    expect(sellingPrice(100, 20)).toBe(120)
    expect(markedPrice(100, 20)).toBe(120)
  })

  it('discount', () => {
    expect(discountAmount(500, 10)).toBe(50)
    expect(priceAfterDiscount(500, 10)).toBe(450)
  })

  it('successive discounts', () => {
    expect(applyDiscounts(500, [10, 5])).toBeCloseTo(427.5, 5)
  })

  it('GST exclusive', () => {
    const r = gstExclusive(1000, 18)
    expect(r.taxable).toBe(1000)
    expect(r.tax).toBe(180)
    expect(r.total).toBe(1180)
  })

  it('GST inclusive', () => {
    const r = gstInclusive(1180, 18)
    expect(r.taxable).toBeCloseTo(1000, 5)
    expect(r.tax).toBeCloseTo(180, 5)
    expect(r.total).toBe(1180)
  })

  it('GST zero rate', () => {
    const r = gstInclusive(1000, 0)
    expect(r.taxable).toBe(1000)
    expect(r.tax).toBe(0)
  })
})