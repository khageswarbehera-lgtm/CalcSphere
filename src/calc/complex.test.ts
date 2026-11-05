import { describe, expect, it } from 'vitest'

import {
  complex,
  complexAdd,
  complexDivide,
  complexMultiply,
  complexSubtract,
  complexToString,
  conjugate,
  magnitude,
  argument,
  complexPow,
} from './complex'
import { CalculationError } from './errors'

describe('complex', () => {
  it('addition', () => {
    expect(complexAdd(complex(1, 2), complex(3, 4))).toEqual({ re: 4, im: 6 })
  })

  it('subtraction', () => {
    expect(complexSubtract(complex(5, 6), complex(2, 3))).toEqual({ re: 3, im: 3 })
  })

  it('multiplication', () => {
    expect(complexMultiply(complex(1, 2), complex(3, 4))).toEqual({ re: -5, im: 10 })
  })

  it('division', () => {
    const r = complexDivide(complex(1, 2), complex(3, 4))
    expect(r.re).toBeCloseTo(0.44, 2)
    expect(r.im).toBeCloseTo(0.08, 2)
  })

  it('division by zero throws', () => {
    expect(() => complexDivide(complex(1, 2), complex(0, 0))).toThrow(CalculationError)
  })

  it('conjugate', () => {
    expect(conjugate(complex(3, 4))).toEqual({ re: 3, im: -4 })
  })

  it('magnitude', () => {
    expect(magnitude(complex(3, 4))).toBe(5)
  })

  it('argument', () => {
    expect(argument(complex(1, 1))).toBeCloseTo(Math.PI / 4, 5)
    expect(() => argument(complex(0, 0))).toThrow(CalculationError)
  })

  it('toString', () => {
    expect(complexToString(complex(3, 4))).toBe('3 + 4i')
    expect(complexToString(complex(5, 0))).toBe('5')
    expect(complexToString(complex(0, 2))).toBe('2i')
  })

  it('power', () => {
    const r = complexPow(complex(1, 1), 2)
    expect(r.re).toBeCloseTo(0, 5)
    expect(r.im).toBeCloseTo(2, 5)
  })
})