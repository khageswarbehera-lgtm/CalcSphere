import { describe, expect, it } from 'vitest'

import {
  averageOf,
  decimalToFraction,
  fractionOperation,
  isPrime,
  percentageChange,
  percentageDecreaseAmount,
  percentageIncreaseAmount,
  percentageOf,
  primeFactors,
  reversePercentageDecrease,
  reversePercentageIncrease,
  simplifyRatio,
  solveProportion,
} from './everyday'
import { CalculationError } from './errors'

describe('everyday math', () => {
  it('percentageOf', () => {
    expect(percentageOf(200, 15)).toBe(30)
    expect(percentageOf(0, 15)).toBe(0)
    expect(percentageOf(-200, 15)).toBe(-30)
  })

  it('percentage increase/decrease', () => {
    expect(percentageIncreaseAmount(100, 20)).toBe(120)
    expect(percentageDecreaseAmount(100, 20)).toBe(80)
  })

  it('percentage change', () => {
    expect(percentageChange(80, 100)).toBe(25)
    expect(() => percentageChange(0, 100)).toThrow(CalculationError)
  })

  it('reverse percentage', () => {
    expect(reversePercentageIncrease(120, 20)).toBeCloseTo(100)
    expect(reversePercentageDecrease(80, 20)).toBeCloseTo(100)
    expect(() => reversePercentageIncrease(100, -100)).toThrow(CalculationError)
  })

  it('simplify ratio', () => {
    expect(simplifyRatio(8, 12)).toEqual([2, 3])
    expect(simplifyRatio(0, 5)).toEqual([0, 1])
    expect(() => simplifyRatio(0, 0)).toThrow(CalculationError)
  })

  it('proportion', () => {
    expect(solveProportion(2, 3, 4)).toBe(6)
    expect(() => solveProportion(0, 3, 4)).toThrow(CalculationError)
  })

  it('fraction operation', () => {
    expect(fractionOperation(1, 2, 1, 3, '+')).toEqual({ numerator: 5, denominator: 6 })
    expect(fractionOperation(1, 2, 1, 2, '-')).toEqual({ numerator: 0, denominator: 1 })
    expect(fractionOperation(2, 3, 3, 4, '*')).toEqual({ numerator: 1, denominator: 2 })
    expect(fractionOperation(1, 2, 1, 2, '/')).toEqual({ numerator: 1, denominator: 1 })
    expect(() => fractionOperation(1, 0, 1, 2, '+')).toThrow(CalculationError)
  })

  it('decimal to fraction', () => {
    expect(decimalToFraction(0.75)).toEqual({ numerator: 3, denominator: 4 })
    expect(decimalToFraction(5)).toEqual({ numerator: 5, denominator: 1 })
  })

  it('average', () => {
    expect(averageOf([10, 20, 30])).toBe(20)
    expect(() => averageOf([])).toThrow(CalculationError)
  })

  it('isPrime', () => {
    expect(isPrime(2)).toBe(true)
    expect(isPrime(17)).toBe(true)
    expect(isPrime(1)).toBe(false)
    expect(isPrime(0)).toBe(false)
    expect(isPrime(-3)).toBe(false)
    expect(() => isPrime(2.5)).toThrow(CalculationError)
  })

  it('primeFactors', () => {
    expect(primeFactors(60)).toEqual([2, 2, 3, 5])
    expect(primeFactors(2)).toEqual([2])
    expect(() => primeFactors(1)).toThrow(CalculationError)
    expect(() => primeFactors(2.5)).toThrow(CalculationError)
  })
})