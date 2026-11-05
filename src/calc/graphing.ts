import { parse } from 'mathjs'
import { CalculationError } from './errors'
import { requireFinite } from './validation'

const ALLOWED_OPERATORS = new Set(['+', '-', '*', '/', '^', '%'])
const ALLOWED_FUNCTIONS = new Set([
  'abs', 'ceil', 'floor', 'round', 'trunc', 'sign',
  'sqrt', 'cbrt', 'pow', 'exp', 'log', 'log10', 'log2', 'ln',
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh', 'min', 'max', 'hypot',
])
const CONSTANTS: Record<string, number> = {
  pi: Math.PI, PI: Math.PI, e: Math.E, E: Math.E, tau: Math.PI * 2,
}

export const MAX_GRAPH_POINTS = 2000
export const MAX_GRAPH_RANGE = 1e6
export const DEFAULT_GRAPH_POINTS = 400

export interface GraphPoint {
  x: number
  y: number | null
}

function validateNode(node: any): void {
  if (!node || typeof node.type !== 'string') throw new CalculationError('PARSE_ERROR', 'Invalid expression')
  switch (node.type) {
    case 'ConstantNode': return
    case 'SymbolNode':
      if (node.name !== 'x' && node.name !== 'X' && !Object.prototype.hasOwnProperty.call(CONSTANTS, node.name)) {
        throw new CalculationError('UNSUPPORTED_SYNTAX', `Unknown symbol: ${node.name}`)
      }
      return
    case 'ParenthesisNode': validateNode(node.content); return
    case 'OperatorNode':
      if (!ALLOWED_OPERATORS.has(node.op)) throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported operator: ${node.op}`)
      if (!Array.isArray(node.args)) throw new CalculationError('PARSE_ERROR', 'Invalid expression')
      node.args.forEach(validateNode)
      return
    case 'FunctionNode':
      if (typeof node.name !== 'string' || !ALLOWED_FUNCTIONS.has(node.name)) throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported function: ${node?.name ?? ''}`)
      if (Array.isArray(node.args)) node.args.forEach(validateNode)
      return
    default: throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported expression element: ${node.type}`)
  }
}
function applyOperator(op: string, args: number[]): number {
  if (op === '-' && args.length === 1) return -args[0]
  if (op === '+' && args.length === 1) return args[0]
  if (args.length !== 2) throw new CalculationError('INVALID_INPUT', `Operator ${op} expects two operands`)
  const [a, b] = args
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/':
      if (b === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Division by zero')
      return a / b
    case '^': {
      const result = a ** b
      if (!Number.isFinite(result)) throw new CalculationError('OVERFLOW', 'Result is not finite')
      return result
    }
    case '%':
      if (b === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Modulo by zero')
      return a % b
    default: throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported operator: ${op}`)
  }
}

function applyFunction(name: string, args: number[]): number {
  args.forEach((v, i) => requireFinite(v, `argument ${i + 1}`))
  switch (name) {
    case 'abs': return Math.abs(args[0])
    case 'ceil': return Math.ceil(args[0])
    case 'floor': return Math.floor(args[0])
    case 'round': return Math.round(args[0])
    case 'trunc': return Math.trunc(args[0])
    case 'sign': return Math.sign(args[0])
    case 'sqrt':
      if (args[0] < 0) throw new CalculationError('DOMAIN_ERROR', 'Square root of a negative number')
      return Math.sqrt(args[0])
    case 'cbrt': return Math.cbrt(args[0])
    case 'pow': return args[0] ** args[1]
    case 'exp': return Math.exp(args[0])
    case 'log':
    case 'ln':
      if (args[0] <= 0) throw new CalculationError('DOMAIN_ERROR', 'Logarithm requires a positive argument')
      return Math.log(args[0])
    case 'log10':
      if (args[0] <= 0) throw new CalculationError('DOMAIN_ERROR', 'Logarithm requires a positive argument')
      return Math.log10(args[0])
    case 'log2':
      if (args[0] <= 0) throw new CalculationError('DOMAIN_ERROR', 'Logarithm requires a positive argument')
      return Math.log2(args[0])
    case 'sin': return Math.sin(args[0])
    case 'cos': return Math.cos(args[0])
    case 'tan': return Math.tan(args[0])
    case 'asin':
      if (args[0] < -1 || args[0] > 1) throw new CalculationError('DOMAIN_ERROR', 'asin domain is [-1, 1]')
      return Math.asin(args[0])
    case 'acos':
      if (args[0] < -1 || args[0] > 1) throw new CalculationError('DOMAIN_ERROR', 'acos domain is [-1, 1]')
      return Math.acos(args[0])
    case 'atan': return Math.atan(args[0])
    case 'sinh': return Math.sinh(args[0])
    case 'cosh': return Math.cosh(args[0])
    case 'tanh': return Math.tanh(args[0])
    case 'min': return Math.min(...args)
    case 'max': return Math.max(...args)
    case 'hypot': return Math.hypot(...args)
    default: throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported function: ${name}`)
  }
}

function evaluateNode(node: any, x: number): number {
  switch (node.type) {
    case 'ConstantNode': return Number(node.value)
    case 'SymbolNode':
      if (node.name === 'x' || node.name === 'X') return x
      if (Object.prototype.hasOwnProperty.call(CONSTANTS, node.name)) return CONSTANTS[node.name]
      throw new CalculationError('INVALID_INPUT', `Unknown symbol: ${node.name}`)
    case 'ParenthesisNode': return evaluateNode(node.content, x)
    case 'OperatorNode': {
      const values = node.args.map((n: any) => evaluateNode(n, x))
      const result = applyOperator(node.op, values)
      if (!Number.isFinite(result)) throw new CalculationError('DOMAIN_ERROR', 'Non-finite result')
      return result
    }
    case 'FunctionNode': {
      const values = (node.args || []).map((n: any) => evaluateNode(n, x))
      const result = applyFunction(node.name, values)
      if (!Number.isFinite(result)) throw new CalculationError('DOMAIN_ERROR', 'Non-finite result')
      return result
    }
    default: throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported expression element: ${node.type}`)
  }
}

export function parseGraphExpression(expression: string): any {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new CalculationError('INVALID_INPUT', 'Expression is empty')
  }
  let node: any
  try {
    node = parse(expression)
  } catch (error) {
    throw new CalculationError('PARSE_ERROR', 'Malformed expression', error)
  }
  validateNode(node)
  return node
}

export function evaluateGraphExpression(expression: string, x: number): number {
  const node = parseGraphExpression(expression)
  const value = evaluateNode(node, requireFinite(x, 'x'))
  if (!Number.isFinite(value)) throw new CalculationError('DOMAIN_ERROR', 'Expression did not produce a finite number')
  return value
}

export function validateGraphRange(xMin: unknown, xMax: unknown, points: unknown): { xMin: number; xMax: number; points: number } {
  const min = requireFinite(xMin, 'x minimum')
  const max = requireFinite(xMax, 'x maximum')
  if (min >= max) throw new CalculationError('INVALID_INPUT', 'x minimum must be less than x maximum')
  if (max - min > MAX_GRAPH_RANGE) throw new CalculationError('INVALID_INPUT', `x range must not exceed ${MAX_GRAPH_RANGE}`)
  const requested = points === undefined ? DEFAULT_GRAPH_POINTS : Math.trunc(requireFinite(points, 'points'))
  if (!Number.isInteger(requested) || requested < 2 || requested > MAX_GRAPH_POINTS) {
    throw new CalculationError('INVALID_INPUT', `points must be an integer between 2 and ${MAX_GRAPH_POINTS}`)
  }
  return { xMin: min, xMax: max, points: requested }
}

export function sampleGraph(expression: string, xMin: unknown, xMax: unknown, points?: unknown): GraphPoint[] {
  const range = validateGraphRange(xMin, xMax, points)
  const step = (range.xMax - range.xMin) / (range.points - 1)
  const samples: GraphPoint[] = []
  for (let i = 0; i < range.points; i += 1) {
    const x = range.xMin + i * step
    try {
      samples.push({ x, y: evaluateGraphExpression(expression, x) })
    } catch {
      samples.push({ x, y: null })
    }
  }
  return samples
}

