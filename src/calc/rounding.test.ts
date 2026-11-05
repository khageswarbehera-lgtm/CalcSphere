import { describe, expect, it } from 'vitest'

import { ceil, floor, round, roundTo, toFixedNumber, truncate } from './rounding'

describe('rounding', () => {
  it('rounds to decimals', () => {
    expect(round(2.345, 2)).toBe(2.35)
    expect(round(2.344, 2)).toBe(2.34)
  })

  it('roundTo alias', () => {
    expect(roundTo(1.005, 2)).toBe(1.01)
  })

  it('floor', () => {
    expect(floor(2.9, 0)).toBe(2)
    expect(floor(2.345, 2)).toBe(2.34)
  })

  it('ceil', () => {
    expect(ceil(2.1, 0)).toBe(3)
    expect(ceil(2.341, 2)).toBe(2.35)
  })

  it('truncate', () => {
    expect(truncate(-2.9, 0)).toBe(-2)
    expect(truncate(2.999, 2)).toBe(2.99)
  })

  it('toFixedNumber', () => {
    expect(toFixedNumber(2.3456, 2)).toBe(2.35)
  })

  it('passes through non-finite values', () => {
    expect(round(Infinity, 2)).toBe(Infinity)
  })
})