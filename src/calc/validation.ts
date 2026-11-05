import { CalculationError } from './errors'

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

export function toNumber(value: unknown, name = 'value'): number {
  const n = Number(value)
  if (Number.isNaN(n)) {
    throw new CalculationError('INVALID_INPUT', `${name} is not a number`)
  }
  return n
}

export function requireFinite(value: unknown, name = 'value'): number {
  const n = toNumber(value, name)
  if (!Number.isFinite(n)) {
    throw new CalculationError('INVALID_INPUT', `${name} must be a finite number`)
  }
  return n
}

export function requirePositive(value: unknown, name = 'value'): number {
  const n = requireFinite(value, name)
  if (n <= 0) {
    throw new CalculationError('INVALID_INPUT', `${name} must be greater than zero`)
  }
  return n
}

export function requireNonNegative(value: unknown, name = 'value'): number {
  const n = requireFinite(value, name)
  if (n < 0) {
    throw new CalculationError('INVALID_INPUT', `${name} must be zero or greater`)
  }
  return n
}