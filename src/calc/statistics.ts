import { CalculationError } from './errors'
import { requireFinite, requireNonNegative, requirePositive } from './validation'

export const MAX_DATASET_SIZE = 100000
export const MAX_COMBINATORIAL_N = 100000

export interface DatasetSummary {
  count: number
  mean: number
  median: number
  mode: number[]
  range: number
  min: number
  max: number
  variance: number
  standardDeviation: number
  populationVariance: number
  sampleVariance: number
}

function toDataset(input: unknown, ...rest: unknown[]): number[] {
  let raw: unknown[]
  if (Array.isArray(input)) {
    raw = input
  } else if (typeof input === 'string') {
    raw = input.split(/[,\s;]+/).filter(token => token.trim() !== '')
  } else if (input && typeof input === 'object' && Array.isArray((input as any).data)) {
    raw = (input as any).data
  } else if (input && typeof input === 'object' && Array.isArray((input as any).values)) {
    raw = (input as any).values
  } else if (typeof input === 'number' || typeof input === 'string' || typeof input === 'boolean') {
    raw = [input, ...rest]
  } else {
    throw new CalculationError('INVALID_INPUT', 'Dataset must be an array or comma-separated string')
  }

  if (raw.length === 0) throw new CalculationError('INVALID_INPUT', 'Dataset must not be empty')
  if (raw.length > MAX_DATASET_SIZE) throw new CalculationError('INVALID_INPUT', `Dataset exceeds maximum size of ${MAX_DATASET_SIZE}`)

  return raw.map((value, index) => {
    const n = Number(value)
    if (!Number.isFinite(n)) throw new CalculationError('INVALID_INPUT', `Non-numeric entry at index ${index}`)
    return n
  })
}

function sortedCopy(data: number[]): number[] {
  return [...data].sort((a, b) => a - b)
}

function validateProbability(value: unknown, name = 'probability'): number {
  const p = requireFinite(value, name)
  if (p < 0 || p > 1) throw new CalculationError('INVALID_INPUT', `${name} must be between 0 and 1`)
  return p
}

function validatePositiveInteger(value: unknown, name: string): number {
  if (!Number.isInteger(Number(value))) throw new CalculationError('INVALID_INPUT', `${name} must be an integer`)
  const result = Math.trunc(Number(value))
  if (result < 0) throw new CalculationError('INVALID_INPUT', `${name} must be non-negative`)
  return result
}
function resolveDataset(args: unknown[]): number[] {
  if (args.length === 0) throw new CalculationError('INVALID_INPUT', 'Dataset must not be empty')
  if (Array.isArray(args[0]) || typeof args[0] === 'string' || (args[0] && typeof args[0] === 'object')) {
    return toDataset(args[0])
  }
  return toDataset(args)
}

export function mean(...args: unknown[]): number {
  const data = resolveDataset(args)
  return data.reduce((a, b) => a + b, 0) / data.length
}

export function median(...args: unknown[]): number {
  const data = resolveDataset(args)
  const sorted = sortedCopy(data)
  const n = sorted.length
  if (n % 2 === 1) return sorted[(n - 1) / 2]
  return (sorted[n / 2 - 1] + sorted[n / 2]) / 2
}

export function mode(...args: unknown[]): number[] {
  const data = resolveDataset(args)
  const counts = new Map<number, number>()
  for (const value of data) counts.set(value, (counts.get(value) ?? 0) + 1)
  const maxCount = Math.max(...counts.values())
  if (maxCount <= 1) return []
  return [...counts.entries()]
    .filter(([, count]) => count === maxCount)
    .map(([value]) => value)
    .sort((a, b) => a - b)
}

export function modes(...args: unknown[]): number[] {
  return mode(...args)
}

export function modeValue(...args: unknown[]): number | null {
  const result = mode(...args)
  return result.length > 0 ? result[0] : null
}

export function range(...args: unknown[]): number {
  const data = resolveDataset(args)
  const sorted = sortedCopy(data)
  return sorted[sorted.length - 1] - sorted[0]
}

function varianceValue(data: number[], population: boolean): number {
  const m = data.reduce((a, b) => a + b, 0) / data.length
  const squared = data.reduce((sum, value) => sum + (value - m) ** 2, 0)
  const denominator = population ? data.length : data.length - 1
  if (denominator <= 0) throw new CalculationError('INVALID_INPUT', 'Sample variance requires at least two observations')
  return squared / denominator
}

function resolvePopulationFlag(value: unknown): boolean | null {
  if (value === undefined) return null
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.toLowerCase()
    if (normalized === 'population' || normalized === 'pop' || normalized === 'p' || normalized === 'biased') return true
    if (normalized === 'sample' || normalized === 'sam' || normalized === 's' || normalized === 'unbiased') return false
    throw new CalculationError('INVALID_INPUT', 'Variance mode must be "population" or "sample"')
  }
  if (value && typeof value === 'object') {
    if ((value as any).population !== undefined) return Boolean((value as any).population)
    if ((value as any).sample !== undefined) return !Boolean((value as any).sample)
  }
  return null
}

export function variance(...args: unknown[]): number {
  const modeFlag = args.length >= 2 ? resolvePopulationFlag(args[args.length - 1]) : null
  const population = modeFlag === null ? false : modeFlag
  const dataArgs = modeFlag === null ? args : args.slice(0, -1)
  const data = resolveDataset(dataArgs.length > 0 ? dataArgs : args)
  return varianceValue(data, population)
}

export function populationVariance(...args: unknown[]): number {
  const data = resolveDataset(args)
  return varianceValue(data, true)
}

export function sampleVariance(...args: unknown[]): number {
  const data = resolveDataset(args)
  return varianceValue(data, false)
}

export function standardDeviation(...args: unknown[]): number {
  const modeFlag = args.length >= 2 ? resolvePopulationFlag(args[args.length - 1]) : null
  const population = modeFlag === null ? false : modeFlag
  const dataArgs = modeFlag === null ? args : args.slice(0, -1)
  const data = resolveDataset(dataArgs.length > 0 ? dataArgs : args)
  return Math.sqrt(varianceValue(data, population))
}

export function populationStandardDeviation(...args: unknown[]): number {
  const data = resolveDataset(args)
  return Math.sqrt(varianceValue(data, true))
}

export function sampleStandardDeviation(...args: unknown[]): number {
  const data = resolveDataset(args)
  return Math.sqrt(varianceValue(data, false))
}

export function percentile(...args: unknown[]): number {
  if (args.length < 2) throw new CalculationError('INVALID_INPUT', 'percentile requires data and p')
  const resolvedData = Array.isArray(args[0]) || typeof args[0] === 'string' || (args[0] && typeof args[0] === 'object')
    ? resolveDataset([args[0]])
    : resolveDataset(args.slice(0, -1))
  const pRaw = requireFinite(args[args.length - 1], 'p')
  if (pRaw < 0) throw new CalculationError('INVALID_INPUT', 'percentile must be non-negative')
  let rankPercent = pRaw
  if (pRaw >= 0 && pRaw <= 1) rankPercent = pRaw * 100
  if (rankPercent > 100) throw new CalculationError('INVALID_INPUT', 'percentile must be <= 100 (or 1 as fraction)')
  const sorted = sortedCopy(resolvedData)
  if (rankPercent === 0) return sorted[0]
  if (rankPercent === 100) return sorted[sorted.length - 1]
  const pos = (rankPercent / 100) * (sorted.length - 1)
  const lower = Math.floor(pos)
  const upper = Math.ceil(pos)
  if (lower === upper) return sorted[lower]
  const weight = pos - lower
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

export function quartiles(...args: unknown[]): { q1: number; median: number; q3: number } {
  const data = resolveDataset(args)
  return {
    q1: percentile(data, 25),
    median: percentile(data, 50),
    q3: percentile(data, 75),
  }
}

export function iqr(...args: unknown[]): number {
  const q = quartiles(...args)
  return q.q3 - q.q1
}

export function factorial(value: unknown): number {
  const n = validatePositiveInteger(value, 'n')
  if (n > 170) throw new CalculationError('OVERFLOW', 'Factorial exceeds representable range')
  let result = 1
  for (let i = 2; i <= n; i += 1) result *= i
  return result
}

export function permutations(n: unknown, r?: unknown): number {
  const N = validatePositiveInteger(n, 'n')
  const R = r === undefined ? N : validatePositiveInteger(r, 'r')
  if (R > N) throw new CalculationError('INVALID_INPUT', 'r cannot exceed n')
  if (N > MAX_COMBINATORIAL_N) throw new CalculationError('INVALID_INPUT', `n exceeds maximum of ${MAX_COMBINATORIAL_N}`)
  let result = 1
  for (let i = 0; i < R; i += 1) {
    result *= N - i
    if (!Number.isFinite(result)) throw new CalculationError('OVERFLOW', 'Permutation result is not finite')
  }
  return result
}

export function combinations(n: unknown, r?: unknown): number {
  const N = validatePositiveInteger(n, 'n')
  const R = r === undefined ? N : validatePositiveInteger(r, 'r')
  if (R > N) throw new CalculationError('INVALID_INPUT', 'r cannot exceed n')
  if (N > MAX_COMBINATORIAL_N) throw new CalculationError('INVALID_INPUT', `n exceeds maximum of ${MAX_COMBINATORIAL_N}`)
  const k = Math.min(R, N - R)
  let result = 1
  for (let i = 1; i <= k; i += 1) {
    result = (result * (N - k + i)) / i
    if (!Number.isFinite(result)) throw new CalculationError('OVERFLOW', 'Combination result is not finite')
  }
  return Math.round(result)
}

export function combinationWithRepetition(n: unknown, r: unknown): number {
  return combinations(Number(n) + Number(r) - 1, r)
}

export function complementProbability(p: unknown): number {
  return 1 - validateProbability(p, 'p')
}

export function unionProbability(pA: unknown, pB: unknown, pIntersection: unknown = 0): number {
  const a = validateProbability(pA, 'pA')
  const b = validateProbability(pB, 'pB')
  const inter = validateProbability(pIntersection, 'pIntersection')
  const result = a + b - inter
  if (result < 0 || result > 1) throw new CalculationError('INVALID_INPUT', 'Resulting probability is outside [0,1]')
  return result
}

export function intersectionIndependent(pA: unknown, pB: unknown): number {
  return validateProbability(pA, 'pA') * validateProbability(pB, 'pB')
}

export function conditionalProbability(pAandB: unknown, pB: unknown): number {
  const denom = validateProbability(pB, 'pB')
  if (denom === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Conditioning probability must not be zero')
  const num = validateProbability(pAandB, 'pAandB')
  const result = num / denom
  if (result > 1) throw new CalculationError('INVALID_INPUT', 'Conditional probability cannot exceed 1')
  return result
}

export function bayesTheorem(pBgivenA: unknown, pA: unknown, pB: unknown): number {
  const denom = validateProbability(pB, 'pB')
  if (denom === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Denominator probability must not be zero')
  return (validateProbability(pBgivenA, 'pBgivenA') * validateProbability(pA, 'pA')) / denom
}

export function binomialProbability(n: unknown, p: unknown, k: unknown): number {
  const N = validatePositiveInteger(n, 'n')
  const P = validateProbability(p, 'p')
  const K = validatePositiveInteger(k, 'k')
  if (K > N) return 0
  return combinations(N, K) * P ** K * (1 - P) ** (N - K)
}

export function binomialCdf(n: unknown, p: unknown, k: unknown): number {
  const N = validatePositiveInteger(n, 'n')
  const K = Math.min(validatePositiveInteger(k, 'k'), N)
  let sum = 0
  for (let i = 0; i <= K; i += 1) sum += binomialProbability(N, p, i)
  return sum
}

export function poissonProbability(lambda: unknown, k: unknown): number {
  const L = requireNonNegative(lambda, 'lambda')
  const K = validatePositiveInteger(k, 'k')
  let result = Math.exp(-L)
  for (let i = 1; i <= K; i += 1) result *= L / i
  return result
}

export function poissonCdf(lambda: unknown, k: unknown): number {
  const K = validatePositiveInteger(k, 'k')
  let sum = 0
  for (let i = 0; i <= K; i += 1) sum += poissonProbability(lambda, i)
  return sum
}

function erfApprox(x: number): number {
  const sign = x < 0 ? -1 : 1
  const a = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * a)
  let poly = 1.061405429
  poly = poly * t - 1.453152027
  poly = poly * t + 1.421413741
  poly = poly * t - 0.284496736
  poly = poly * t + 0.254829592
  poly = poly * t
  const y = 1 - poly * Math.exp(-a * a)
  return sign * y
}

export function normalPdf(x: unknown, meanValue: unknown = 0, stdDev: unknown = 1): number {
  const X = requireFinite(x, 'x')
  const M = requireFinite(meanValue, 'mean')
  const S = requirePositive(stdDev, 'standard deviation')
  return (1 / (S * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((X - M) / S) ** 2)
}

export function normalCdf(x: unknown, meanValue: unknown = 0, stdDev: unknown = 1): number {
  const X = requireFinite(x, 'x')
  const M = requireFinite(meanValue, 'mean')
  const S = requirePositive(stdDev, 'standard deviation')
  return 0.5 * (1 + erfApprox((X - M) / (S * Math.sqrt(2))))
}

export function uniformPdf(x: unknown, a: unknown, b: unknown): number {
  const X = requireFinite(x, 'x')
  const A = requireFinite(a, 'a')
  const B = requireFinite(b, 'b')
  if (A >= B) throw new CalculationError('INVALID_INPUT', 'a must be less than b')
  return X >= A && X <= B ? 1 / (B - A) : 0
}

export function uniformCdf(x: unknown, a: unknown, b: unknown): number {
  const X = requireFinite(x, 'x')
  const A = requireFinite(a, 'a')
  const B = requireFinite(b, 'b')
  if (A >= B) throw new CalculationError('INVALID_INPUT', 'a must be less than b')
  if (X < A) return 0
  if (X > B) return 1
  return (X - A) / (B - A)
}

export function exponentialPdf(x: unknown, rate: unknown): number {
  const X = requireFinite(x, 'x')
  const L = requirePositive(rate, 'rate')
  if (X < 0) return 0
  return L * Math.exp(-L * X)
}

export function exponentialCdf(x: unknown, rate: unknown): number {
  const X = requireFinite(x, 'x')
  const L = requirePositive(rate, 'rate')
  if (X < 0) return 0
  return 1 - Math.exp(-L * X)
}

export function geometricProbability(p: unknown, k: unknown): number {
  const P = validateProbability(p, 'p')
  const K = validatePositiveInteger(k, 'k')
  if (K < 1) throw new CalculationError('INVALID_INPUT', 'k must be at least 1')
  return (1 - P) ** (K - 1) * P
}

export function geometricCdf(p: unknown, k: unknown): number {
  const P = validateProbability(p, 'p')
  const K = validatePositiveInteger(k, 'k')
  if (K < 1) return 0
  return 1 - (1 - P) ** K
}

export function hypergeometricProbability(N: unknown, K: unknown, n: unknown, k: unknown): number {
  const pop = validatePositiveInteger(N, 'N')
  const succ = validatePositiveInteger(K, 'K')
  const draw = validatePositiveInteger(n, 'n')
  const x = validatePositiveInteger(k, 'k')
  if (succ > pop || draw > pop) throw new CalculationError('INVALID_INPUT', 'K and n cannot exceed N')
  if (x > Math.min(draw, succ)) return 0
  const numerator = combinations(succ, x) * combinations(pop - succ, draw - x)
  const denominator = combinations(pop, draw)
  return numerator / denominator
}

export function descriptiveStatistics(...args: unknown[]): DatasetSummary {
  const data = resolveDataset(args)
  const popVar = varianceValue(data, true)
  const samVar = data.length > 1 ? varianceValue(data, false) : NaN
  return {
    count: data.length,
    mean: mean(data),
    median: median(data),
    mode: mode(data),
    range: range(data),
    min: Math.min(...data),
    max: Math.max(...data),
    variance: samVar,
    standardDeviation: Math.sqrt(samVar),
    populationVariance: popVar,
    sampleVariance: samVar,
  }
}

// Aliases
export const calculateMean = mean
export const calculateMedian = median
export const calculateMode = mode
export const calculateRange = range
export const calculateVariance = variance
export const calculateStandardDeviation = standardDeviation
export const calculatePercentile = percentile
export const perm = permutations
export const nPr = permutations
export const nCr = combinations
export const choose = combinations
export const binomialPmf = binomialProbability
export const binomialCdfValue = binomialCdf
export const poissonPmf = poissonProbability
export const poissonCdfValue = poissonCdf
export const normalPdfValue = normalPdf
export const normalCdfValue = normalCdf
export const uniformPdfValue = uniformPdf
export const uniformCdfValue = uniformCdf
export const exponentialPdfValue = exponentialPdf
export const exponentialCdfValue = exponentialCdf
export const geometricPmf = geometricProbability
export const geometricCdfValue = geometricCdf
export const summary = descriptiveStatistics
export const describeDataset = descriptiveStatistics
export const datasetSummary = descriptiveStatistics
export const stdev = standardDeviation
export const std = standardDeviation

