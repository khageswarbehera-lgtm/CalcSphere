import { describe, expect, it } from 'vitest'

import { differentiate, integrate, solveEquation } from './advanced'

describe('advanced', () => {
  it('solveEquation', () => expect(solveEquation('x^2 - 5*x + 6', 'x')).toBe('[2,3]'))
  it('differentiate', () => expect(differentiate('x^3 + 2*x', 'x')).toBe('2+3*x^2'))
  it('integrate', () => expect(integrate('x^3 + 2*x', 'x')).toBe('(1/4)*x^4+x^2'))
  it('solveEquation throws on invalid input', () => {
    expect(() => solveEquation('x^2 +', 'x')).toThrow()
  })
})