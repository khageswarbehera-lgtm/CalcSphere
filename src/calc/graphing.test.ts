import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import { evaluateGraphExpression, parseGraphExpression, sampleGraph, validateGraphRange } from './graphing'

describe('function graphing', () => {
  it('parses and evaluates', () => {
    expect(evaluateGraphExpression('x^2 + 1', 2)).toBe(5)
    expect(evaluateGraphExpression('sin(x)', 0)).toBe(0)
  })

  it('samples graph', () => {
    const samples = sampleGraph('x', 0, 2, 3)
    expect(samples).toHaveLength(3)
    expect(samples[0]).toEqual({ x: 0, y: 0 })
    expect(samples[2]).toEqual({ x: 2, y: 2 })
  })

  it('handles invalid expressions', () => {
    expect(() => parseGraphExpression('x +')).toThrow(CalculationError)
    expect(() => parseGraphExpression('foo(x)')).toThrow(CalculationError)
    expect(() => evaluateGraphExpression('1/0', 1)).toThrow(CalculationError)
  })

  it('validates range', () => {
    expect(() => validateGraphRange(5, 3, 10)).toThrow(CalculationError)
    expect(() => validateGraphRange(0, 10, 1)).toThrow(CalculationError)
    expect(() => validateGraphRange(0, 10, 3000)).toThrow(CalculationError)
    expect(() => validateGraphRange(0, 2e6, 10)).toThrow(CalculationError)
  })

  it('records null for domain errors', () => {
    const samples = sampleGraph('1/x', -1, 1, 3)
    expect(samples[1].y).toBeNull()
  })
})
