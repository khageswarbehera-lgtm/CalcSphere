import { create, all } from 'mathjs'

import { CalculationError } from './errors'
import { requireFinite } from './validation'

const math = create(all)

export function evaluateExpression(expression: string): string {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new CalculationError('INVALID_INPUT', 'Expression is empty')
  }
  const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/')
  try {
    const result = math.evaluate(normalized)
    if (result === undefined || result === null) {
      throw new CalculationError('PARSE_ERROR', 'Invalid expression')
    }
    return String(result)
  } catch (error) {
    if (error instanceof CalculationError) throw error
    throw new CalculationError('PARSE_ERROR', 'Invalid expression')
  }
}

export function safeAdd(a: number, b: number): number {
  return requireFinite(a, 'a') + requireFinite(b, 'b')
}

export function safeSubtract(a: number, b: number): number {
  return requireFinite(a, 'a') - requireFinite(b, 'b')
}

export function safeMultiply(a: number, b: number): number {
  return requireFinite(a, 'a') * requireFinite(b, 'b')
}

export function safeDivide(a: number, b: number): number {
  const divisor = requireFinite(b, 'b')
  if (divisor === 0) {
    throw new CalculationError('DIVISION_BY_ZERO', 'Division by zero is not allowed')
  }
  return requireFinite(a, 'a') / divisor
}

export function safePower(base: number, exponent: number): number {
  const b = requireFinite(base, 'base')
  const e = requireFinite(exponent, 'exponent')
  const result = b ** e
  if (!Number.isFinite(result)) {
    throw new CalculationError('OVERFLOW', 'Result is not finite')
  }
  return result
}

export function safeModulo(a: number, b: number): number {
  const divisor = requireFinite(b, 'b')
  if (divisor === 0) {
    throw new CalculationError('DIVISION_BY_ZERO', 'Modulo by zero is not allowed')
  }
  return requireFinite(a, 'a') % divisor
}

export function safeSqrt(value: number): number {
  const n = requireFinite(value, 'value')
  if (n < 0) {
    throw new CalculationError('DOMAIN_ERROR', 'Square root of a negative number is not real')
  }
  return Math.sqrt(n)
}

export function safeAbs(value: number): number {
  return Math.abs(requireFinite(value, 'value'))
}

export function safeFactorial(value: number): number {
  const n = requireFinite(value, 'value')
  if (n < 0 || !Number.isInteger(n)) {
    throw new CalculationError('DOMAIN_ERROR', 'Factorial requires a non-negative integer')
  }
  let result = 1
  for (let i = 2; i <= n; i += 1) result *= i
  return result
}

export function safePercent(value: number, percent: number): number {
  return safeMultiply(value, safeDivide(percent, 100))
}
