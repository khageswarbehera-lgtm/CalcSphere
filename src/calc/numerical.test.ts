import { describe, expect, it } from 'vitest'

import {
  arithmeticSeriesSum,
  bisection,
  geometricSeriesInfiniteSum,
  geometricSeriesSum,
  limit,
  newtonRaphson,
  simpsonIntegral,
  summation,
  trapezoidalIntegral,
} from './numerical'
import { CalculationError } from './errors'

describe('numerical limits', () => {
  it('solves a basic limit', () => {
    expect(limit('x^2', 'x', 2)).toBe('4')
  })

  it('solves a 0/0 limit', () => {
    expect(limit('sin(x)/x', 'x', 0)).toBe('1')
  })

  it('returns unsupported for an unsolved limit', () => {
    expect(limit('x*sin(1/x)', 'x', 0).startsWith('Unsupported:')).toBe(true)
  })

  it('handles infinity point', () => {
    expect(limit('1/x', 'x', 'Infinity')).toBe('0')
  })
})

describe('numerical summation', () => {
  it('sums a finite series', () => {
    expect(summation('i^2', 'i', 1, 5)).toBe(55)
  })

  it('sums with default variable', () => {
    expect(summation('i', 1, 3)).toBe(6)
  })

  it('returns 0 for empty range', () => {
    expect(summation('i', 'i', 5, 2)).toBe(0)
  })
})

describe('series', () => {
  it('arithmetic series sum', () => {
    expect(arithmeticSeriesSum(2, 3, 4)).toBe(26)
  })

  it('geometric series finite sum', () => {
    expect(geometricSeriesSum(1, 0.5, 4)).toBeCloseTo(1.875, 6)
  })

  it('geometric infinite converges', () => {
    expect(geometricSeriesInfiniteSum(1, 0.5)).toBe(2)
  })

  it('geometric infinite diverges', () => {
    expect(() => geometricSeriesInfiniteSum(1, 2)).toThrow(CalculationError)
  })

  it('geometric endpoint |r|=1 diverges', () => {
    expect(() => geometricSeriesInfiniteSum(1, 1)).toThrow(CalculationError)
    expect(() => geometricSeriesInfiniteSum(1, -1)).toThrow(CalculationError)
  })
})

describe('bisection', () => {
  it('converges for a simple root', () => {
    const r = bisection((x: number) => x * x - 2, 1, 2)
    expect(r.converged).toBe(true)
    expect(r.root).toBeCloseTo(1.41421356, 6)
  })

  it('handles endpoint root', () => {
    const r = bisection((x: number) => x - 1, 1, 2)
    expect(r.converged).toBe(true)
    expect(r.root).toBe(1)
  })

  it('fails without sign change', () => {
    const r = bisection((x: number) => x * x + 1, -1, 1)
    expect(r.converged).toBe(false)
  })

  it('fails to converge with tight iterations', () => {
    const r = bisection((x: number) => x * x - 2, 1, 2, 1e-15, 1)
    expect(r.converged).toBe(false)
  })

  it('works with string expression', () => {
    const r = bisection('x^2 - 2', 1, 2)
    expect(r.converged).toBe(true)
    expect(r.root).toBeCloseTo(1.41421356, 6)
  })
})

describe('newton-raphson', () => {
  it('converges for a simple root', () => {
    const r = newtonRaphson((x: number) => x * x - 2, (x: number) => 2 * x, 1.5)
    expect(r.converged).toBe(true)
    expect(r.root).toBeCloseTo(1.41421356, 6)
  })

  it('safeguards division by zero', () => {
    const r = newtonRaphson((x: number) => x * x, (x: number) => 2 * x, 0)
    expect(r.converged).toBe(false)
    expect(r.message).toContain('division by zero')
  })

  it('fails to converge within limit', () => {
    const r = newtonRaphson((x: number) => Math.sin(x), (x: number) => Math.cos(x), 100, 1e-12, 2)
    expect(r.converged).toBe(false)
  })

  it('supports numeric derivative', () => {
    const r = newtonRaphson((x: number) => x * x - 2, 1.5)
    expect(r.converged).toBe(true)
    expect(r.root).toBeCloseTo(1.41421356, 6)
  })
})

describe('numerical integration', () => {
  it('trapezoidal integrates x^2', () => {
    expect(trapezoidalIntegral((x: number) => x * x, 0, 1, 1000)).toBeCloseTo(1 / 3, 6)
  })

  it('simpson integrates x^2', () => {
    expect(simpsonIntegral((x: number) => x * x, 0, 1, 100)).toBeCloseTo(1 / 3, 10)
  })

  it('trapezoidal with expression string', () => {
    expect(trapezoidalIntegral('x^2', 0, 1, 100)).toBeCloseTo(1 / 3, 4)
  })
})
