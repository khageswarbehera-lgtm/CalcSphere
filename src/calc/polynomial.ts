import { requireFinite } from './validation'
import { CalculationError } from './errors'

export interface LinearResult {
  kind: 'none' | 'infinite' | 'one'
  root?: number
  method: string
}

export interface QuadraticResult {
  a: number
  b: number
  c: number
  discriminant: number
  count: number
  status: 'degenerate-linear' | 'no-real-roots' | 'repeated-real-root' | 'two-distinct-real-roots' | 'infinite-solutions' | 'no-solution'
  roots: string[]
  method: string
}

export function solveLinear(a: number, b: number): LinearResult {
  const A = requireFinite(a, 'a')
  const B = requireFinite(b, 'b')
  if (A === 0) {
    if (B === 0) return { kind: 'infinite', method: 'Degenerate: 0 = 0' }
    return { kind: 'none', method: 'Degenerate: 0 = non-zero' }
  }
  return { kind: 'one', root: -B / A, method: 'Linear formula x = -b/a' }
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  const A = requireFinite(a, 'a')
  const B = requireFinite(b, 'b')
  const C = requireFinite(c, 'c')

  if (A === 0) {
    const linear = solveLinear(B, C)
    if (linear.kind === 'infinite') {
      return { a: A, b: B, c: C, discriminant: 0, count: Infinity as unknown as number, status: 'infinite-solutions', roots: ['all real numbers'], method: 'Degenerate quadratic reduces to 0 = 0' }
    }
    if (linear.kind === 'none') {
      return { a: A, b: B, c: C, discriminant: 0, count: 0, status: 'no-solution', roots: [], method: 'Degenerate quadratic reduces to 0 = non-zero' }
    }
    return { a: A, b: B, c: C, discriminant: 0, count: 1, status: 'degenerate-linear', roots: [`x = ${linear.root}`], method: 'Degenerate quadratic reduces to linear formula x = -c/b' }
  }

  const discriminant = B * B - 4 * A * C
  const eps = 1e-12

  if (Math.abs(discriminant) <= eps) {
    const root = -B / (2 * A)
    return {
      a: A, b: B, c: C, discriminant: 0, count: 1, status: 'repeated-real-root',
      roots: [`x = ${root} (repeated)`], method: 'Quadratic formula with discriminant 0',
    }
  }

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant)
    const r1 = (-B + sqrtD) / (2 * A)
    const r2 = (-B - sqrtD) / (2 * A)
    return {
      a: A, b: B, c: C, discriminant, count: 2, status: 'two-distinct-real-roots',
      roots: [`x₁ = ${r1}`, `x₂ = ${r2}`], method: 'Quadratic formula',
    }
  }

  const realPart = -B / (2 * A)
  const imagPart = Math.sqrt(-discriminant) / (2 * Math.abs(A))
  return {
    a: A, b: B, c: C, discriminant, count: 2, status: 'no-real-roots',
    roots: [`x = ${realPart} + ${imagPart}i`, `x = ${realPart} - ${imagPart}i`],
    method: 'Quadratic formula (complex roots)',
  }
}