import { describe, expect, it } from 'vitest'

import { isFiniteNumber, requireFinite, requireNonNegative, requirePositive, toNumber } from './validation'
import { CalculationError } from './errors'

describe('validation', () => {
  it('isFiniteNumber', () => {
    expect(isFiniteNumber(5)).toBe(true)
    expect(isFiniteNumber(Infinity)).toBe(false)
    expect(isFiniteNumber(NaN)).toBe(false)
    expect(isFiniteNumber('5')).toBe(false)
  })

  it('toNumber converts valid values', () => {
    expect(toNumber('42')).toBe(42)
    expect(toNumber(true)).toBe(1)
  })

  it('toNumber throws for NaN', () => {
    expect(() => toNumber('abc')).toThrow(CalculationError)
  })

  it('requireFinite accepts finite numbers', () => {
    expect(requireFinite(3.5)).toBe(3.5)
  })

  it('requireFinite throws for non-finite', () => {
    expect(() => requireFinite(Infinity)).toThrow(CalculationError)
    expect(() => requireFinite('x')).toThrow(CalculationError)
  })

  it('requirePositive throws for zero and negatives', () => {
    expect(() => requirePositive(0)).toThrow(CalculationError)
    expect(() => requirePositive(-1)).toThrow(CalculationError)
    expect(requirePositive(2)).toBe(2)
  })

  it('requireNonNegative allows zero', () => {
    expect(requireNonNegative(0)).toBe(0)
    expect(() => requireNonNegative(-1)).toThrow(CalculationError)
  })
})