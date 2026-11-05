import { describe, expect, it } from 'vitest'

import {
  evaluateExpression,
  safeAbs,
  safeAdd,
  safeDivide,
  safeFactorial,
  safeModulo,
  safeMultiply,
  safePercent,
  safePower,
  safeSqrt,
  safeSubtract,
} from './arithmetic'
import { CalculationError } from './errors'

describe('arithmetic', () => {
  it('evaluateExpression computes basic math', () => {
    expect(evaluateExpression('2 + 3')).toBe('5')
  })

  it('evaluateExpression normalizes symbols', () => {
    expect(evaluateExpression('2×3')).toBe('6')
    expect(evaluateExpression('6÷2')).toBe('3')
  })

  it('evaluateExpression returns Infinity for division by zero', () => {
    expect(evaluateExpression('1 / 0')).toBe('Infinity')
  })

  it('evaluateExpression throws for invalid input', () => {
    expect(() => evaluateExpression('abc')).toThrow(CalculationError)
    expect(() => evaluateExpression('')).toThrow(CalculationError)
  })

  it('safe arithmetic operations', () => {
    expect(safeAdd(1.2, 2.3)).toBeCloseTo(3.5)
    expect(safeSubtract(5, 2)).toBe(3)
    expect(safeMultiply(3, 4)).toBe(12)
    expect(safeDivide(10, 2)).toBe(5)
    expect(safePower(2, 3)).toBe(8)
    expect(safeModulo(10, 3)).toBe(1)
    expect(safeSqrt(9)).toBe(3)
    expect(safeAbs(-4)).toBe(4)
    expect(safeFactorial(5)).toBe(120)
    expect(safePercent(200, 10)).toBe(20)
  })

  it('safeDivide throws on zero', () => {
    expect(() => safeDivide(1, 0)).toThrow(CalculationError)
  })

  it('safeSqrt throws on negative', () => {
    expect(() => safeSqrt(-1)).toThrow(CalculationError)
  })

  it('safeFactorial throws on non-integer', () => {
    expect(() => safeFactorial(2.5)).toThrow(CalculationError)
    expect(() => safeFactorial(-1)).toThrow(CalculationError)
  })
})