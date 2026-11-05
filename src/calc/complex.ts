import { requireFinite } from './validation'
import { CalculationError } from './errors'

export interface Complex {
  re: number
  im: number
}

export function complex(re: number, im = 0): Complex {
  return { re: requireFinite(re, 're'), im: requireFinite(im, 'im') }
}

export function complexAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im }
}

export function complexSubtract(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im }
}

export function complexMultiply(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }
}

export function complexDivide(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im
  if (denom === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Cannot divide by zero complex number')
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  }
}

export function conjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im }
}

export function magnitude(z: Complex): number {
  return Math.hypot(z.re, z.im)
}

export function argument(z: Complex): number {
  if (z.re === 0 && z.im === 0) throw new CalculationError('DOMAIN_ERROR', 'Argument of zero is undefined')
  return Math.atan2(z.im, z.re)
}

export function complexToString(z: Complex): string {
  const re = z.re
  const im = z.im
  if (im === 0) return String(re)
  if (re === 0) return `${im}i`
  const sign = im > 0 ? '+' : '-'
  return `${re} ${sign} ${Math.abs(im)}i`
}

export function complexPow(z: Complex, n: number): Complex {
  if (!Number.isInteger(n)) throw new CalculationError('DOMAIN_ERROR', 'Only integer powers are supported')
  if (n === 0) return { re: 1, im: 0 }
  const r = magnitude(z)
  if (r === 0) return { re: 0, im: 0 }
  const theta = argument(z)
  if (n < 0) {
    if (r === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Cannot raise zero to a negative power')
    const pos = complexPow(z, -n)
    return complexDivide({ re: 1, im: 0 }, pos)
  }
  const rn = r ** n
  return { re: rn * Math.cos(n * theta), im: rn * Math.sin(n * theta) }
}