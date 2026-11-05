import { describe, expect, it } from 'vitest'

import { average, clamp, gcd, lcm, max, min, sum } from './math'

describe('math', () => {
  it('clamp', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(11, 0, 10)).toBe(10)
  })

  it('min/max', () => {
    expect(min(1, 2, 3)).toBe(1)
    expect(max(1, 2, 3)).toBe(3)
  })

  it('sum/average', () => {
    expect(sum(1, 2, 3)).toBe(6)
    expect(average(2, 4)).toBe(3)
  })

  it('gcd/lcm', () => {
    expect(gcd(12, 18)).toBe(6)
    expect(lcm(4, 6)).toBe(12)
  })
})