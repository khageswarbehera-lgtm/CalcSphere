import { gcd, lcm } from './math'
import { requireFinite, requireNonNegative } from './validation'
import { CalculationError } from './errors'

export function percentageOf(value: number, percent: number): number {
  return (requireFinite(value, 'value') * requireFinite(percent, 'percent')) / 100
}

export function percentageIncreaseAmount(original: number, percent: number): number {
  const base = requireFinite(original, 'original')
  const p = requireFinite(percent, 'percent')
  return base * (1 + p / 100)
}

export function percentageDecreaseAmount(original: number, percent: number): number {
  const base = requireFinite(original, 'original')
  const p = requireFinite(percent, 'percent')
  return base * (1 - p / 100)
}

export function percentageChange(original: number, newValue: number): number {
  const base = requireFinite(original, 'original')
  if (base === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Original value cannot be zero')
  return ((requireFinite(newValue, 'newValue') - base) / base) * 100
}

export function reversePercentageIncrease(finalValue: number, percent: number): number {
  const final = requireFinite(finalValue, 'finalValue')
  const p = requireFinite(percent, 'percent')
  const denominator = 1 + p / 100
  if (denominator === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Denominator is zero')
  return final / denominator
}

export function reversePercentageDecrease(finalValue: number, percent: number): number {
  const final = requireFinite(finalValue, 'finalValue')
  const p = requireFinite(percent, 'percent')
  const denominator = 1 - p / 100
  if (denominator === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Denominator is zero')
  return final / denominator
}

export function simplifyRatio(a: number, b: number): [number, number] {
  const x = requireFinite(a, 'a')
  const y = requireFinite(b, 'b')
  if (x === 0 && y === 0) throw new CalculationError('INVALID_INPUT', 'Both ratio terms cannot be zero')
  const g = gcd(x === 0 ? y : x, y === 0 ? x : y)
  const divisor = g === 0 ? 1 : Math.abs(g)
  return [x / divisor, y / divisor]
}

export function solveProportion(a: number, b: number, c: number): number {
  const x = requireFinite(a, 'a')
  const y = requireFinite(b, 'b')
  const z = requireFinite(c, 'c')
  if (x === 0) throw new CalculationError('DIVISION_BY_ZERO', 'The first term cannot be zero')
  return (y * z) / x
}

export function fractionOperation(
  aNum: number, aDen: number,
  bNum: number, bDen: number,
  operation: '+' | '-' | '*' | '/',
): { numerator: number; denominator: number } {
  const an = requireFinite(aNum, 'aNum')
  const ad = requireFinite(aDen, 'aDen')
  const bn = requireFinite(bNum, 'bNum')
  const bd = requireFinite(bDen, 'bDen')
  if (ad === 0 || bd === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Denominator cannot be zero')
  let num = 0
  let den = 1
  switch (operation) {
    case '+':
      num = an * bd + bn * ad
      den = ad * bd
      break
    case '-':
      num = an * bd - bn * ad
      den = ad * bd
      break
    case '*':
      num = an * bn
      den = ad * bd
      break
    case '/':
      if (bn === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Cannot divide by zero fraction')
      num = an * bd
      den = ad * bn
      break
  }
  if (den < 0) {
    num = -num
    den = -den
  }
  const g = gcd(num === 0 ? den : num, den)
  const divisor = g === 0 ? 1 : Math.abs(g)
  return { numerator: num / divisor, denominator: den / divisor }
}

export function decimalToFraction(value: number): { numerator: number; denominator: number } {
  const n = requireFinite(value, 'value')
  const str = String(n)
  if (!str.includes('.')) {
    return { numerator: n, denominator: 1 }
  }
  const decimals = str.split('.')[1].length
  const scale = 10 ** decimals
  const num = Math.round(n * scale)
  const den = scale
  const g = gcd(num === 0 ? den : num, den)
  const divisor = g === 0 ? 1 : Math.abs(g)
  return { numerator: num / divisor, denominator: den / divisor }
}

export function averageOf(values: number[]): number {
  if (!Array.isArray(values) || values.length === 0) {
    throw new CalculationError('INVALID_INPUT', 'At least one value is required')
  }
  const nums = values.map((v, i) => requireFinite(v, `values[${i}]`))
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

export function isPrime(n: number): boolean {
  const value = requireFinite(n, 'n')
  if (!Number.isInteger(value)) throw new CalculationError('INVALID_INPUT', 'Prime check requires an integer')
  if (value < 2) return false
  if (value === 2) return true
  if (value % 2 === 0) return false
  const limit = Math.floor(Math.sqrt(value))
  for (let i = 3; i <= limit; i += 2) {
    if (value % i === 0) return false
  }
  return true
}

export function primeFactors(n: number): number[] {
  const value = requireFinite(n, 'n')
  if (!Number.isInteger(value)) throw new CalculationError('INVALID_INPUT', 'Prime factorization requires an integer')
  if (value < 2) throw new CalculationError('INVALID_INPUT', 'Prime factorization requires an integer >= 2')
  const factors: number[] = []
  let remaining = value
  let divisor = 2
  while (divisor * divisor <= remaining) {
    while (remaining % divisor === 0) {
      factors.push(divisor)
      remaining /= divisor
    }
    divisor = divisor === 2 ? 3 : divisor + 2
  }
  if (remaining > 1) factors.push(remaining)
  return factors
}