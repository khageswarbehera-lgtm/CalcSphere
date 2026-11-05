import { describe, expect, it } from 'vitest'

import { solveLinear, solveQuadratic } from './polynomial'

describe('polynomial', () => {
  it('linear one solution', () => {
    const r = solveLinear(2, -4)
    expect(r.kind).toBe('one')
    expect(r.root).toBe(2)
  })

  it('linear no solution', () => {
    expect(solveLinear(0, 5).kind).toBe('none')
  })

  it('linear infinite solutions', () => {
    expect(solveLinear(0, 0).kind).toBe('infinite')
  })

  it('quadratic two distinct real roots', () => {
    const r = solveQuadratic(1, -5, 6)
    expect(r.status).toBe('two-distinct-real-roots')
    expect(r.count).toBe(2)
  })

  it('quadratic repeated root', () => {
    const r = solveQuadratic(1, -2, 1)
    expect(r.status).toBe('repeated-real-root')
    expect(r.count).toBe(1)
  })

  it('quadratic complex roots', () => {
    const r = solveQuadratic(1, 0, 1)
    expect(r.status).toBe('no-real-roots')
    expect(r.count).toBe(2)
    expect(r.roots[0]).toContain('i')
  })

  it('quadratic degenerate to linear', () => {
    const r = solveQuadratic(0, 2, -4)
    expect(r.status).toBe('degenerate-linear')
    expect(r.roots[0]).toContain('2')
  })

  it('quadratic degenerate no solution', () => {
    const r = solveQuadratic(0, 0, 5)
    expect(r.status).toBe('no-solution')
  })

  it('quadratic degenerate infinite', () => {
    const r = solveQuadratic(0, 0, 0)
    expect(r.status).toBe('infinite-solutions')
  })
})