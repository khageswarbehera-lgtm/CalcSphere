import { create, all } from 'mathjs'
import nerdamer from 'nerdamer/all'

import { CalculationError } from './errors'
import { requireFinite, toNumber } from './validation'

const math = create(all)

export type MathFunction = (x: number) => number

export interface LimitResult {
  expression: string
  variable: string
  point: string
  result: string
  supported: boolean
  method: string
}

export interface SeriesResult {
  firstTerm: number
  ratio?: number
  difference?: number
  terms: number
  sum: number | null
  converged: boolean | null
  method: string
}

export interface RootFindingOptions {
  tolerance?: number
  maxIterations?: number
  initialGuess?: number
  derivative?: MathFunction | string
}

export interface RootFindingResult {
  method: string
  root: number | null
  iterations: number
  converged: boolean
  tolerance: number
  maxIterations: number
  message: string
  fRoot: number | null
}

export interface IntegrationResult {
  method: string
  value: number
  intervals: number
  estimatedError: number
}

const DEFAULT_TOLERANCE = 1e-10
const DEFAULT_MAX_ITERATIONS = 100
const DEFAULT_INTEGRATION_INTERVALS = 100

function requireFunctionInput(value: unknown, name = 'function'): MathFunction {
  if (typeof value === 'function') return value as MathFunction
  if (typeof value === 'string') {
    const expression = value.trim()
    if (!expression) throw new CalculationError('INVALID_INPUT', `${name} expression is empty`)
    return (x: number) => {
      const result = math.evaluate(expression, { x, X: x, t: x })
      return requireFinite(result, `${name}(x)`)
    }
  }
  throw new CalculationError('INVALID_INPUT', `${name} must be a function or expression string`)
}

function toFiniteNumber(value: unknown, name = 'value'): number {
  return requireFinite(value, name)
}
function parseRootArgs(args: unknown[]): {
  f: MathFunction
  a?: number
  b?: number
  x0?: number
  derivative?: MathFunction
  tolerance: number
  maxIterations: number
} {
  let f: MathFunction
  let a: number | undefined
  let b: number | undefined
  let x0: number | undefined
  let derivative: MathFunction | undefined
  let tolerance = DEFAULT_TOLERANCE
  let maxIterations = DEFAULT_MAX_ITERATIONS

  if (args.length > 0 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0]) && typeof (args[0] as any).f !== 'undefined') {
    const o = args[0] as any
    f = requireFunctionInput(o.f ?? o.function ?? o.expr ?? o.expression, 'f')
    a = o.a ?? o.lower ?? o.left
    b = o.b ?? o.upper ?? o.right
    x0 = o.x0 ?? o.initialGuess ?? o.initial ?? o.start
    if (o.derivative !== undefined) derivative = requireFunctionInput(o.derivative, 'derivative')
    if (o.tolerance !== undefined) tolerance = toFiniteNumber(o.tolerance, 'tolerance')
    if (o.maxIterations !== undefined) maxIterations = Math.trunc(toFiniteNumber(o.maxIterations, 'maxIterations'))
    return { f, a, b, x0, derivative, tolerance, maxIterations }
  }

  f = requireFunctionInput(args[0], 'f')

  if ((typeof args[1] === 'function' || typeof args[1] === 'string') && (typeof args[2] === 'number' || (typeof args[2] === 'string' && !Number.isNaN(Number(args[2]))))) {
    derivative = requireFunctionInput(args[1], 'derivative')
    x0 = toFiniteNumber(args[2], 'x0')
    applyRest(args.slice(3))
  } else {
    if (args.length === 2) {
      x0 = toFiniteNumber(args[1], 'x0')
      applyRest(args.slice(2))
    } else {
      if (args[1] !== undefined) a = toFiniteNumber(args[1], 'a')
      if (args[2] !== undefined) b = toFiniteNumber(args[2], 'b')
      applyRest(args.slice(3))
    }
  }

  function applyRest(rest: unknown[]) {
    if (rest.length === 0) return
    if (typeof rest[0] === 'object' && rest[0] !== null) {
      const o = rest[0] as any
      if (o.tolerance !== undefined) tolerance = toFiniteNumber(o.tolerance, 'tolerance')
      if (o.maxIterations !== undefined) maxIterations = Math.trunc(toFiniteNumber(o.maxIterations, 'maxIterations'))
      if (o.initialGuess !== undefined) x0 = toFiniteNumber(o.initialGuess, 'initialGuess')
      if (o.derivative !== undefined) derivative = requireFunctionInput(o.derivative, 'derivative')
    } else {
      if (rest[0] !== undefined) tolerance = toFiniteNumber(rest[0], 'tolerance')
      if (rest[1] !== undefined) maxIterations = Math.trunc(toFiniteNumber(rest[1], 'maxIterations'))
    }
  }

  return { f, a, b, x0, derivative, tolerance, maxIterations }
}

function parseSeriesArgs(args: unknown[]): { first: number; second: number; terms?: number } {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    const o = args[0] as any
    return {
      first: toFiniteNumber(o.first ?? o.firstTerm ?? o.a ?? o.start, 'firstTerm'),
      second: toFiniteNumber(o.second ?? o.commonDifference ?? o.commonRatio ?? o.d ?? o.r ?? o.difference ?? o.ratio, 'second'),
      terms: o.terms ?? o.n ?? o.count,
    }
  }
  if (args.length >= 3) {
    return {
      first: toFiniteNumber(args[0], 'firstTerm'),
      second: toFiniteNumber(args[1], 'second'),
      terms: args[2] !== undefined ? Math.trunc(toFiniteNumber(args[2], 'terms')) : undefined,
    }
  }
  if (args.length === 2) {
    return {
      first: toFiniteNumber(args[0], 'firstTerm'),
      second: toFiniteNumber(args[1], 'second'),
    }
  }
  throw new CalculationError('INVALID_INPUT', 'Expected at least two numeric arguments')
}

function parseIntegrationArgs(args: unknown[]): { f: MathFunction; a: number; b: number; n: number } {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    const o = args[0] as any
    return {
      f: requireFunctionInput(o.f ?? o.function ?? o.expr ?? o.expression, 'f'),
      a: toFiniteNumber(o.a ?? o.lower ?? o.from, 'a'),
      b: toFiniteNumber(o.b ?? o.upper ?? o.to, 'b'),
      n: o.n ?? o.intervals ?? o.steps ?? DEFAULT_INTEGRATION_INTERVALS,
    }
  }
  const f = requireFunctionInput(args[0], 'f')
  const a = toFiniteNumber(args[1], 'a')
  const b = toFiniteNumber(args[2], 'b')
  const n = args[3] !== undefined ? Math.trunc(toFiniteNumber(args[3], 'n')) : DEFAULT_INTEGRATION_INTERVALS
  return { f, a, b, n }
}

function parseSummationArgs(args: unknown[]): { expression: string; variable: string; start: number; end: number } {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    const o = args[0] as any
    return {
      expression: String(o.expression ?? o.expr ?? o.f ?? ''),
      variable: String(o.variable ?? o.index ?? 'i'),
      start: toFiniteNumber(o.start ?? o.from ?? o.lower, 'start'),
      end: toFiniteNumber(o.end ?? o.to ?? o.upper, 'end'),
    }
  }
  if (args.length === 3) {
    return {
      expression: String(args[0]),
      variable: 'i',
      start: toFiniteNumber(args[1], 'start'),
      end: toFiniteNumber(args[2], 'end'),
    }
  }
  if (args.length >= 4) {
    return {
      expression: String(args[0]),
      variable: String(args[1]),
      start: toFiniteNumber(args[2], 'start'),
      end: toFiniteNumber(args[3], 'end'),
    }
  }
  throw new CalculationError('INVALID_INPUT', 'summation requires expression, start and end')
}

function formatPoint(point: unknown): string {
  if (point === Infinity || point === 'Infinity' || point === '+Infinity') return 'Infinity'
  if (point === -Infinity || point === '-Infinity') return '-Infinity'
  const n = Number(point)
  if (Number.isFinite(n)) return String(n)
  return String(point)
}

function isUnsupportedLimit(result: string, original: string): boolean {
  const r = result.trim()
  if (!r) return true
  if (r.toLowerCase().includes('limit(')) return true
  if (r === original.trim()) return true
  if (r.includes('NaN')) return true
  return false
}

function tryEvaluateNumeric(expression: string): string | null {
  try {
    const value = math.evaluate(expression)
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
    if (value && typeof value.toString === 'function') {
      const s = value.toString()
      if (/^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(s.trim())) return s.trim()
    }
  } catch {
    // ignore
  }
  return null
}

export function limit(expression: unknown, variable?: unknown, point?: unknown): string {
  if (typeof expression === 'object' && expression !== null && variable === undefined) {
    const o = expression as any
    return limit(o.expression ?? o.expr ?? o.f, o.variable ?? o.var ?? 'x', o.point ?? o.value ?? o.to)
  }
  const expr = String(expression ?? '').trim()
  const v = String(variable ?? 'x').trim() || 'x'
  if (!expr) throw new CalculationError('INVALID_INPUT', 'expression is empty')
  if (!v) throw new CalculationError('INVALID_INPUT', 'variable is empty')
  const p = formatPoint(point)
  const original = `limit(${expr}, ${v}, ${p})`
  try {
    const raw = nerdamer(original).toString()
    const evaluated = tryEvaluateNumeric(raw)
    const result = evaluated ?? raw
    if (isUnsupportedLimit(result, original)) {
      return `Unsupported: symbolic limit could not be resolved for ${expr} as ${v} -> ${p}`
    }
    return result
  } catch {
    return `Unsupported: symbolic limit could not be resolved for ${expr} as ${v} -> ${p}`
  }
}

export function limitResult(expression: unknown, variable?: unknown, point?: unknown): LimitResult {
  let expr: string
  let v: string
  let p: unknown
  if (typeof expression === 'object' && expression !== null && variable === undefined) {
    const o = expression as any
    expr = String(o.expression ?? o.expr ?? o.f ?? '')
    v = String(o.variable ?? o.var ?? 'x')
    p = o.point ?? o.value ?? o.to
  } else {
    expr = String(expression ?? '')
    v = String(variable ?? 'x')
    p = point
  }
  const result = limit(expression, variable, point)
  const supported = !result.startsWith('Unsupported:')
  return {
    expression: expr,
    variable: v,
    point: formatPoint(p),
    result,
    supported,
    method: 'Symbolic limit via CAS (nerdamer)',
  }
}

export function summation(...args: unknown[]): number {
  const { expression, variable, start, end } = parseSummationArgs(args)
  if (!expression.trim()) throw new CalculationError('INVALID_INPUT', 'expression is empty')
  if (start > end) return 0
  const f = (i: number) => {
    const value = math.evaluate(expression, { [variable]: i })
    return requireFinite(value, `term at ${variable}=${i}`)
  }
  let total = 0
  for (let i = Math.trunc(start); i <= end; i += 1) {
    total += f(i)
  }
  return total
}

export function arithmeticSeriesSum(...args: unknown[]): number {
  const { first, second, terms } = parseSeriesArgs(args)
  const n = terms ?? 0
  if (!Number.isInteger(n) || n < 0) throw new CalculationError('INVALID_INPUT', 'terms must be a non-negative integer')
  const d = second
  if (n === 0) return 0
  if (d === 0) return first * n
  return (n / 2) * (2 * first + (n - 1) * d)
}

export function arithmeticSeriesNthTerm(...args: unknown[]): number {
  const { first, second, terms } = parseSeriesArgs(args)
  const n = terms ?? 1
  if (!Number.isInteger(n) || n < 1) throw new CalculationError('INVALID_INPUT', 'term number must be a positive integer')
  return first + (n - 1) * second
}

export function geometricSeriesSum(...args: unknown[]): number {
  const { first, second, terms } = parseSeriesArgs(args)
  const n = terms ?? 0
  if (!Number.isInteger(n) || n < 0) throw new CalculationError('INVALID_INPUT', 'terms must be a non-negative integer')
  const r = second
  if (n === 0) return 0
  if (r === 1) return first * n
  return (first * (1 - r ** n)) / (1 - r)
}

export function geometricSeriesInfiniteSum(...args: unknown[]): number {
  const { first, second } = parseSeriesArgs(args)
  const r = second
  if (Math.abs(r) >= 1) {
    throw new CalculationError('DOMAIN_ERROR', 'Geometric series diverges for |r| >= 1')
  }
  return first / (1 - r)
}

export function geometricSeriesInfinite(...args: unknown[]): SeriesResult {
  const { first, second } = parseSeriesArgs(args)
  const r = second
  const converged = Math.abs(r) < 1
  return {
    firstTerm: first,
    ratio: r,
    terms: Infinity as unknown as number,
    sum: converged ? first / (1 - r) : null,
    converged,
    method: converged ? 'Infinite geometric series a/(1-r)' : 'Divergent: |r| >= 1',
  }
}

export function bisection(...args: unknown[]): RootFindingResult {
  const { f, a, b, tolerance, maxIterations } = parseRootArgs(args)
  const tol = tolerance > 0 ? tolerance : DEFAULT_TOLERANCE
  const maxIter = maxIterations > 0 ? maxIterations : DEFAULT_MAX_ITERATIONS

  if (a === undefined || b === undefined) {
    throw new CalculationError('INVALID_INPUT', 'bisection requires lower and upper bounds')
  }
  const lo0 = toFiniteNumber(a, 'a')
  const hi0 = toFiniteNumber(b, 'b')
  let lo = Math.min(lo0, hi0)
  let hi = Math.max(lo0, hi0)

  let fLo = f(lo)
  let fHi = f(hi)
  if (!Number.isFinite(fLo) || !Number.isFinite(fHi)) {
    return {
      method: 'Bisection',
      root: null,
      iterations: 0,
      converged: false,
      tolerance: tol,
      maxIterations: maxIter,
      message: 'Function values must be finite at the endpoints',
      fRoot: null,
    }
  }

  if (fLo === 0) {
    return { method: 'Bisection', root: lo, iterations: 0, converged: true, tolerance: tol, maxIterations: maxIter, message: 'Exact root at left endpoint', fRoot: 0 }
  }
  if (fHi === 0) {
    return { method: 'Bisection', root: hi, iterations: 0, converged: true, tolerance: tol, maxIterations: maxIter, message: 'Exact root at right endpoint', fRoot: 0 }
  }
  if (fLo * fHi > 0) {
    return {
      method: 'Bisection',
      root: null,
      iterations: 0,
      converged: false,
      tolerance: tol,
      maxIterations: maxIter,
      message: 'No sign change in interval; bisection cannot proceed',
      fRoot: null,
    }
  }

  let mid = (lo + hi) / 2
  let fMid = f(mid)
  let iterations = 0
  for (let i = 1; i <= maxIter; i += 1) {
    iterations = i
    mid = (lo + hi) / 2
    fMid = f(mid)
    if (!Number.isFinite(fMid)) {
      return { method: 'Bisection', root: mid, iterations, converged: false, tolerance: tol, maxIterations: maxIter, message: 'Non-finite function value encountered', fRoot: null }
    }
    const halfWidth = (hi - lo) / 2
    if (Math.abs(fMid) <= tol || halfWidth <= tol) {
      return { method: 'Bisection', root: mid, iterations, converged: true, tolerance: tol, maxIterations: maxIter, message: 'Converged', fRoot: fMid }
    }
    if (fLo * fMid <= 0) {
      hi = mid
      fHi = fMid
    } else {
      lo = mid
      fLo = fMid
    }
  }
  mid = (lo + hi) / 2
  fMid = f(mid)
  return {
    method: 'Bisection',
    root: mid,
    iterations,
    converged: false,
    tolerance: tol,
    maxIterations: maxIter,
    message: 'Failed to converge within iteration limit',
    fRoot: Number.isFinite(fMid) ? fMid : null,
  }
}

export function newtonRaphson(...args: unknown[]): RootFindingResult {
  const { f, derivative, x0, tolerance, maxIterations } = parseRootArgs(args)
  const tol = tolerance > 0 ? tolerance : DEFAULT_TOLERANCE
  const maxIter = maxIterations > 0 ? maxIterations : DEFAULT_MAX_ITERATIONS
  let x = x0 !== undefined ? toFiniteNumber(x0, 'x0') : 0
  const df = derivative
  const numericDerivative = (value: number) => {
    const h = 1e-6
    const f1 = f(value + h)
    const f2 = f(value - h)
    return (f1 - f2) / (2 * h)
  }

  for (let i = 1; i <= maxIter; i += 1) {
    const fx = f(x)
    if (!Number.isFinite(fx)) {
      return { method: 'Newton-Raphson', root: x, iterations: i - 1, converged: false, tolerance: tol, maxIterations: maxIter, message: 'Non-finite function value encountered', fRoot: null }
    }
    const dfx = df ? df(x) : numericDerivative(x)
    if (!Number.isFinite(dfx) || dfx === 0) {
      return { method: 'Newton-Raphson', root: x, iterations: i - 1, converged: false, tolerance: tol, maxIterations: maxIter, message: 'Derivative is zero or non-finite; division by zero safeguard triggered', fRoot: fx }
    }
    const xNew = x - fx / dfx
    if (!Number.isFinite(xNew)) {
      return { method: 'Newton-Raphson', root: x, iterations: i, converged: false, tolerance: tol, maxIterations: maxIter, message: 'Iteration produced a non-finite value', fRoot: fx }
    }
    if (Math.abs(xNew - x) <= tol || Math.abs(f(xNew)) <= tol) {
      return { method: 'Newton-Raphson', root: xNew, iterations: i, converged: true, tolerance: tol, maxIterations: maxIter, message: 'Converged', fRoot: f(xNew) }
    }
    x = xNew
  }
  const finalFx = f(x)
  return {
    method: 'Newton-Raphson',
    root: x,
    iterations: maxIter,
    converged: false,
    tolerance: tol,
    maxIterations: maxIter,
    message: 'Failed to converge within iteration limit',
    fRoot: Number.isFinite(finalFx) ? finalFx : null,
  }
}

function parseIntegrationArgsFull(args: unknown[]): { f: MathFunction; a: number; b: number; n: number } {
  const parsed = parseIntegrationArgs(args)
  let n = parsed.n
  if (!Number.isInteger(n) || n <= 0) n = DEFAULT_INTEGRATION_INTERVALS
  return { ...parsed, n }
}

export function trapezoidalIntegral(...args: unknown[]): number {
  const { f, a, b, n } = parseIntegrationArgsFull(args)
  const h = (b - a) / n
  let sum = (f(a) + f(b)) / 2
  for (let i = 1; i < n; i += 1) {
    sum += f(a + i * h)
  }
  return sum * h
}

export function trapezoidalIntegralResult(...args: unknown[]): IntegrationResult {
  const { f, a, b, n } = parseIntegrationArgsFull(args)
  const value = trapezoidalIntegral(f, a, b, n)
  const value2 = trapezoidalIntegral(f, a, b, Math.min(n * 2, 100000))
  return {
    method: 'Trapezoidal rule',
    value,
    intervals: n,
    estimatedError: Math.abs(value2 - value),
  }
}

export function simpsonIntegral(...args: unknown[]): number {
  const { f, a, b, n } = parseIntegrationArgsFull(args)
  const intervals = n % 2 === 0 ? n : n + 1
  const h = (b - a) / intervals
  let sum = f(a) + f(b)
  for (let i = 1; i < intervals; i += 1) {
    const x = a + i * h
    sum += i % 2 === 0 ? 2 * f(x) : 4 * f(x)
  }
  return (sum * h) / 3
}

export function simpsonIntegralResult(...args: unknown[]): IntegrationResult {
  const { f, a, b, n } = parseIntegrationArgsFull(args)
  const intervals = n % 2 === 0 ? n : n + 1
  const value = simpsonIntegral(f, a, b, intervals)
  const value2 = simpsonIntegral(f, a, b, Math.min(intervals * 2, 100000))
  return {
    method: "Simpson's rule",
    value,
    intervals,
    estimatedError: Math.abs(value2 - value),
  }
}

// Aliases and compatibility names
export const calculateLimit = limit
export const symbolicLimit = limit
export const limitDetailed = limitResult
export const analyzeLimit = limitResult
export const calculateLimitResult = limitResult

export const sumSeries = summation
export const finiteSum = summation
export const calculateSummation = summation
export const summate = summation

export const arithmeticSeries = arithmeticSeriesSum
export const arithmeticProgressionSum = arithmeticSeriesSum
export const sumArithmeticSeries = arithmeticSeriesSum
export const arithmeticNthTerm = arithmeticSeriesNthTerm

export const geometricSeriesFiniteSum = geometricSeriesSum
export const geometricProgressionSum = geometricSeriesSum
export const sumGeometricSeries = geometricSeriesSum
export const geometricSeries = geometricSeriesSum

export const bisectionMethod = bisection
export const bisectionDetailed = bisection
export const findRootBisection = bisection

export const newtonMethod = newtonRaphson
export const newtonRaphsonMethod = newtonRaphson
export const newtonDetailed = newtonRaphson
export const findRootNewton = newtonRaphson

export const trapezoidalRule = trapezoidalIntegral
export const trapezoidal = trapezoidalIntegral
export const integrateTrapezoidal = trapezoidalIntegral
export const trapezoidalResult = trapezoidalIntegralResult

export const simpsonRule = simpsonIntegral
export const simpson = simpsonIntegral
export const integrateSimpson = simpsonIntegral
export const simpsonResult = simpsonIntegralResult

