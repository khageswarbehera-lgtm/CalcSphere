import { requireFinite } from './validation'

export function clamp(value: number, min: number, max: number): number {
  const v = requireFinite(value, 'value')
  const lo = requireFinite(min, 'min')
  const hi = requireFinite(max, 'max')
  if (lo > hi) throw new Error('min must be <= max')
  return Math.min(Math.max(v, lo), hi)
}

export function min(...values: number[]): number {
  if (values.length === 0) throw new Error('min requires at least one value')
  values.forEach((v, i) => requireFinite(v, `values[${i}]`))
  return Math.min(...values)
}

export function max(...values: number[]): number {
  if (values.length === 0) throw new Error('max requires at least one value')
  values.forEach((v, i) => requireFinite(v, `values[${i}]`))
  return Math.max(...values)
}

export function average(...values: number[]): number {
  if (values.length === 0) throw new Error('average requires at least one value')
  values.forEach((v, i) => requireFinite(v, `values[${i}]`))
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function sum(...values: number[]): number {
  values.forEach((v, i) => requireFinite(v, `values[${i}]`))
  return values.reduce((a, b) => a + b, 0)
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(requireFinite(a, 'a'))
  let y = Math.abs(requireFinite(b, 'b'))
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

export function lcm(a: number, b: number): number {
  const g = gcd(a, b)
  if (g === 0) return 0
  return Math.abs(requireFinite(a, 'a') * requireFinite(b, 'b')) / g
}