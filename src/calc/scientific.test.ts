import { describe, expect, it } from 'vitest'

import { evaluateScientific, evaluateScientificValue } from './scientific'
import { CalculationError } from './errors'

describe('scientific evaluator', () => {
  it('respects precedence', () => {
    expect(evaluateScientific('2 + 3 * 4')).toBe('14')
  })

  it('handles brackets', () => {
    expect(evaluateScientific('(2 + 3) * 4')).toBe('20')
    expect(evaluateScientific('((1+2)*(3+4))')).toBe('21')
  })

  it('handles decimals and powers', () => {
    expect(evaluateScientific('2.5 ^ 2')).toBe('6.25')
  })

  it('supports constants', () => {
    expect(evaluateScientific('pi')).toBe(String(Math.PI))
    expect(evaluateScientific('2 * pi')).toBe(String(2 * Math.PI))
  })

  it('trigonometry in radians', () => {
    expect(evaluateScientific('sin(pi/2)')).toBe('1')
    expect(evaluateScientific('cos(0)')).toBe('1')
  })

  it('trigonometry in degrees', () => {
    expect(evaluateScientific('sin(90)', { angleMode: 'deg' })).toBe('1')
    expect(evaluateScientific('cos(180)', { angleMode: 'deg' })).toBe('-1')
  })

  it('logarithms', () => {
    expect(evaluateScientific('log(e)')).toBe('1')
    expect(evaluateScientific('log10(100)')).toBe('2')
    expect(evaluateScientific('log(8, 2)')).toBe('3')
  })

  it('roots', () => {
    expect(evaluateScientific('sqrt(9)')).toBe('3')
    expect(evaluateScientific('cbrt(27)')).toBe('3')
    expect(evaluateScientific('nthRoot(16, 4)')).toBe('2')
  })

  it('functions min/max/abs', () => {
    expect(evaluateScientific('min(3, 1, 2)')).toBe('1')
    expect(evaluateScientific('max(3, 1, 2)')).toBe('3')
    expect(evaluateScientific('abs(-5)')).toBe('5')
  })

  it('factorial', () => {
    expect(evaluateScientific('5!')).toBe('120')
    expect(evaluateScientific('factorial(5)')).toBe('120')
  })

  it('throws on malformed expression', () => {
    expect(() => evaluateScientific('2 +')).toThrow(CalculationError)
  })

  it('throws on division by zero', () => {
    expect(() => evaluateScientific('1 / 0')).toThrow(CalculationError)
  })

  it('throws on invalid logarithm', () => {
    expect(() => evaluateScientific('log(0)')).toThrow(CalculationError)
    expect(() => evaluateScientific('log(-1)')).toThrow(CalculationError)
  })

  it('throws on invalid root', () => {
    expect(() => evaluateScientific('sqrt(-1)')).toThrow(CalculationError)
  })

  it('throws on overflow', () => {
    expect(() => evaluateScientific('1e309')).toThrow(CalculationError)
    expect(() => evaluateScientific('exp(10000)')).toThrow(CalculationError)
  })

  it('throws on unsupported syntax', () => {
    expect(() => evaluateScientific('process.exit()')).toThrow(CalculationError)
    expect(() => evaluateScientific('foo')).toThrow(CalculationError)
    expect(() => evaluateScientific('1 + 2; 3')).toThrow(CalculationError)
  })

  it('rejects arbitrary property access', () => {
    expect(() => evaluateScientific('constructor')).toThrow(CalculationError)
  })

  it('value helper returns number', () => {
    expect(evaluateScientificValue('2+2')).toBe(4)
  })
})