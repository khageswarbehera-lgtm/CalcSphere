import { parse } from 'mathjs'

import { CalculationError } from './errors'
import { isFiniteNumber, requireFinite } from './validation'
import { safeDivide, safeFactorial, safePower } from './arithmetic'

export type AngleMode = 'deg' | 'rad'

const ALLOWED_OPERATORS = new Set(['+', '-', '*', '/', '^', '%', '!'])

const ALLOWED_FUNCTIONS = new Set([
  'abs', 'ceil', 'floor', 'round', 'trunc', 'sign',
  'sqrt', 'cbrt', 'nthRoot', 'pow', 'exp', 'log', 'log10', 'log2', 'ln',
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'min', 'max', 'hypot', 'factorial', 'mod',
])

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  PI: Math.PI,
  e: Math.E,
  E: Math.E,
  tau: Math.PI * 2,
  phi: (1 + Math.sqrt(5)) / 2,
}

function toRadians(value: number, mode: AngleMode): number {
  return mode === 'deg' ? (value * Math.PI) / 180 : value
}

function fromRadians(value: number, mode: AngleMode): number {
  return mode === 'deg' ? (value * 180) / Math.PI : value
}

function ensureFinite(value: unknown, context: string): number {
  if (typeof value === 'object' && value !== null && 're' in (value as any) && 'im' in (value as any)) {
    throw new CalculationError('DOMAIN_ERROR', `${context} produced a complex number`)
  }
  const n = Number(value)
  if (!Number.isFinite(n)) {
    throw new CalculationError('DOMAIN_ERROR', `${context} produced a non-finite result`)
  }
  return n
}

function applyOperator(op: string, args: number[]): number {
  if (op === '!' ) {
    if (args.length !== 1) throw new CalculationError('INVALID_INPUT', 'Factorial expects one operand')
    return safeFactorial(args[0])
  }
  if (op === '-' && args.length === 1) {
    return -args[0]
  }
  if (op === '+' && args.length === 1) {
    return args[0]
  }
  if (args.length !== 2) throw new CalculationError('INVALID_INPUT', `Operator ${op} expects two operands`)
  const [a, b] = args
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      if (b === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Division by zero is not allowed')
      return a / b
    case '^':
      return safePower(a, b)
    case '%':
      if (b === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Modulo by zero is not allowed')
      return a % b
    default:
      throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported operator: ${op}`)
  }
}

function applyFunction(name: string, args: number[], mode: AngleMode): number {
  if (!ALLOWED_FUNCTIONS.has(name)) {
    throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported function: ${name}`)
  }
  args.forEach((v, i) => requireFinite(v, `argument ${i + 1}`))

  switch (name) {
    case 'abs':
      return Math.abs(args[0])
    case 'ceil':
      return Math.ceil(args[0])
    case 'floor':
      return Math.floor(args[0])
    case 'round':
      return Math.round(args[0])
    case 'trunc':
      return Math.trunc(args[0])
    case 'sign':
      return Math.sign(args[0])
    case 'sqrt':
      if (args[0] < 0) throw new CalculationError('DOMAIN_ERROR', 'Square root of a negative number is not real')
      return Math.sqrt(args[0])
    case 'cbrt':
      return Math.cbrt(args[0])
    case 'nthRoot': {
      const root = args[1] ?? 2
      if (root === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Root index cannot be zero')
      const result = Math.pow(args[0], 1 / root)
      return ensureFinite(result, 'nthRoot')
    }
    case 'pow':
      return safePower(args[0], args[1])
    case 'exp': {
      const result = Math.exp(args[0])
      return ensureFinite(result, 'exp')
    }
    case 'log': {
      if (args[0] <= 0) throw new CalculationError('DOMAIN_ERROR', 'Logarithm requires a positive argument')
      if (args.length === 2) {
        if (args[1] <= 0 || args[1] === 1) throw new CalculationError('DOMAIN_ERROR', 'Invalid logarithm base')
        return Math.log(args[0]) / Math.log(args[1])
      }
      return Math.log(args[0])
    }
    case 'ln':
      if (args[0] <= 0) throw new CalculationError('DOMAIN_ERROR', 'Logarithm requires a positive argument')
      return Math.log(args[0])
    case 'log10':
      if (args[0] <= 0) throw new CalculationError('DOMAIN_ERROR', 'Logarithm requires a positive argument')
      return Math.log10(args[0])
    case 'log2':
      if (args[0] <= 0) throw new CalculationError('DOMAIN_ERROR', 'Logarithm requires a positive argument')
      return Math.log2(args[0])
    case 'sin':
      return Math.sin(toRadians(args[0], mode))
    case 'cos':
      return Math.cos(toRadians(args[0], mode))
    case 'tan':
      return Math.tan(toRadians(args[0], mode))
    case 'asin':
      if (args[0] < -1 || args[0] > 1) throw new CalculationError('DOMAIN_ERROR', 'asin argument must be between -1 and 1')
      return fromRadians(Math.asin(args[0]), mode)
    case 'acos':
      if (args[0] < -1 || args[0] > 1) throw new CalculationError('DOMAIN_ERROR', 'acos argument must be between -1 and 1')
      return fromRadians(Math.acos(args[0]), mode)
    case 'atan':
      return fromRadians(Math.atan(args[0]), mode)
    case 'sinh':
      return Math.sinh(args[0])
    case 'cosh':
      return Math.cosh(args[0])
    case 'tanh':
      return Math.tanh(args[0])
    case 'asinh':
      return Math.asinh(args[0])
    case 'acosh':
      if (args[0] < 1) throw new CalculationError('DOMAIN_ERROR', 'acosh argument must be >= 1')
      return Math.acosh(args[0])
    case 'atanh':
      if (args[0] <= -1 || args[0] >= 1) throw new CalculationError('DOMAIN_ERROR', 'atanh argument must be between -1 and 1')
      return Math.atanh(args[0])
    case 'min':
      return Math.min(...args)
    case 'max':
      return Math.max(...args)
    case 'hypot':
      return Math.hypot(...args)
    case 'factorial':
      return safeFactorial(args[0])
    case 'mod': {
      if (args[1] === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Modulo by zero is not allowed')
      return args[0] % args[1]
    }
    default:
      throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported function: ${name}`)
  }
}

function validateNode(node: any): void {
  if (!node || typeof node.type !== 'string') {
    throw new CalculationError('PARSE_ERROR', 'Invalid expression')
  }
  switch (node.type) {
    case 'ConstantNode':
      return
    case 'SymbolNode':
      if (!Object.prototype.hasOwnProperty.call(CONSTANTS, node.name)) {
        throw new CalculationError('INVALID_INPUT', `Unknown symbol: ${node.name}`)
      }
      return
    case 'ParenthesisNode':
      validateNode(node.content)
      return
    case 'OperatorNode':
      if (!ALLOWED_OPERATORS.has(node.op)) {
        throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported operator: ${node.op}`)
      }
      if (!Array.isArray(node.args)) throw new CalculationError('PARSE_ERROR', 'Invalid expression')
      node.args.forEach(validateNode)
      return
    case 'FunctionNode':
      if (typeof node.name !== 'string' || !ALLOWED_FUNCTIONS.has(node.name)) {
        throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported function: ${node?.name ?? ''}`)
      }
      if (Array.isArray(node.args)) node.args.forEach(validateNode)
      return
    default:
      throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported expression element: ${node.type}`)
  }
}

function evaluateNode(node: any, mode: AngleMode): number {
  switch (node.type) {
    case 'ConstantNode':
      return ensureFinite(node.value, 'constant')
    case 'SymbolNode':
      if (!Object.prototype.hasOwnProperty.call(CONSTANTS, node.name)) throw new CalculationError('INVALID_INPUT', `Unknown symbol: ${node.name}`)
      return CONSTANTS[node.name]
    case 'ParenthesisNode':
      return evaluateNode(node.content, mode)
    case 'OperatorNode': {
      const values = node.args.map((n: any) => evaluateNode(n, mode))
      const result = applyOperator(node.op, values)
      return ensureFinite(result, `operator ${node.op}`)
    }
    case 'FunctionNode': {
      const values = (node.args || []).map((n: any) => evaluateNode(n, mode))
      const result = applyFunction(node.name, values, mode)
      return ensureFinite(result, node.name)
    }
    default:
      throw new CalculationError('UNSUPPORTED_SYNTAX', `Unsupported expression element: ${node.type}`)
  }
}

export function evaluateScientificValue(expression: string, options?: { angleMode?: AngleMode }): number {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new CalculationError('INVALID_INPUT', 'Expression is empty')
  }
  const mode = options?.angleMode ?? 'rad'
  let node: any
  try {
    node = parse(expression)
  } catch (error) {
    throw new CalculationError('PARSE_ERROR', 'Malformed expression', error)
  }
  validateNode(node)
  try {
    return evaluateNode(node, mode)
  } catch (error) {
    if (error instanceof CalculationError) throw error
    throw new CalculationError('UNKNOWN', 'Calculation failed', error)
  }
}

export function evaluateScientific(expression: string, options?: { angleMode?: AngleMode }): string {
  return String(evaluateScientificValue(expression, options))
}