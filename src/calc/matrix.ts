import { create, all } from 'mathjs'

const math = create(all)

import { CalculationError } from './errors'
import { requireFinite } from './validation'

export type Matrix = number[][]
export type Vector = number[]

function requireMatrix(value: unknown, name = 'matrix'): Matrix {
  if (!Array.isArray(value) || value.length === 0) {
    throw new CalculationError('INVALID_INPUT', `${name} must be a non-empty 2D array`)
  }
  const rows = value as unknown[]
  const width = Array.isArray(rows[0]) ? (rows[0] as unknown[]).length : 0
  if (width === 0) throw new CalculationError('INVALID_INPUT', `${name} must have at least one column`)
  const result: Matrix = []
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i]
    if (!Array.isArray(row) || row.length !== width) {
      throw new CalculationError('INVALID_INPUT', `${name} must be rectangular`)
    }
    const parsed: number[] = []
    for (let j = 0; j < row.length; j += 1) {
      parsed.push(requireFinite(row[j], `${name}[${i}][${j}]`))
    }
    result.push(parsed)
  }
  return result
}

function dimensions(m: Matrix): [number, number] {
  return [m.length, m[0].length]
}

function toMathMatrix(m: Matrix): any {
  return math.matrix(m)
}

function toArray(m: any): Matrix {
  const arr = m.toArray ? m.toArray() : m
  return arr.map((row: any) => (Array.isArray(row) ? row.map((v: any) => Number(v)) : [Number(row)]))
}

export function parseMatrix(text: string): Matrix {
  const lines = text.trim().split(/\n+/).map(line => line.trim()).filter(Boolean)
  if (lines.length === 0) throw new CalculationError('INVALID_INPUT', 'Matrix input is empty')
  const rows = lines.map(line =>
    line.split(/[\s,;]+/).filter(Boolean).map(token => {
      const n = Number(token)
      if (Number.isNaN(n)) throw new CalculationError('INVALID_INPUT', `Invalid number: ${token}`)
      return n
    }),
  )
  return requireMatrix(rows, 'matrix')
}

export function parseVector(text: string): Vector {
  const tokens = text.trim().split(/[\s,;]+/).filter(Boolean)
  if (tokens.length === 0) throw new CalculationError('INVALID_INPUT', 'Vector input is empty')
  return tokens.map(token => {
    const n = Number(token)
    if (Number.isNaN(n)) throw new CalculationError('INVALID_INPUT', `Invalid number: ${token}`)
    return requireFinite(n, 'vector element')
  })
}

export function matrixAdd(a: Matrix, b: Matrix): Matrix {
  const A = requireMatrix(a, 'A')
  const B = requireMatrix(b, 'B')
  const [ar, ac] = dimensions(A)
  const [br, bc] = dimensions(B)
  if (ar !== br || ac !== bc) {
    throw new CalculationError('INVALID_INPUT', `Dimension mismatch: A is ${ar}×${ac}, B is ${br}×${bc}`)
  }
  return toArray(math.add(toMathMatrix(A), toMathMatrix(B)))
}

export function matrixSubtract(a: Matrix, b: Matrix): Matrix {
  const A = requireMatrix(a, 'A')
  const B = requireMatrix(b, 'B')
  const [ar, ac] = dimensions(A)
  const [br, bc] = dimensions(B)
  if (ar !== br || ac !== bc) {
    throw new CalculationError('INVALID_INPUT', `Dimension mismatch: A is ${ar}×${ac}, B is ${br}×${bc}`)
  }
  return toArray(math.subtract(toMathMatrix(A), toMathMatrix(B)))
}

export function matrixMultiply(a: Matrix, b: Matrix): Matrix {
  const A = requireMatrix(a, 'A')
  const B = requireMatrix(b, 'B')
  const [ar, ac] = dimensions(A)
  const [br, bc] = dimensions(B)
  if (ac !== br) {
    throw new CalculationError('INVALID_INPUT', `Dimension mismatch: A columns (${ac}) must equal B rows (${br})`)
  }
  return toArray(math.multiply(toMathMatrix(A), toMathMatrix(B)))
}

export function transpose(m: Matrix): Matrix {
  const M = requireMatrix(m, 'matrix')
  return toArray(math.transpose(toMathMatrix(M)))
}

export function determinant(m: Matrix): number {
  const M = requireMatrix(m, 'matrix')
  const [r, c] = dimensions(M)
  if (r !== c) {
    throw new CalculationError('INVALID_INPUT', `Determinant requires a square matrix, got ${r}×${c}`)
  }
  const d = math.det(toMathMatrix(M))
  return requireFinite(d, 'determinant')
}

export function inverse(m: Matrix): Matrix {
  const M = requireMatrix(m, 'matrix')
  const [r, c] = dimensions(M)
  if (r !== c) {
    throw new CalculationError('INVALID_INPUT', `Inverse requires a square matrix, got ${r}×${c}`)
  }
  const d = math.det(toMathMatrix(M))
  if (Math.abs(d) < 1e-12) {
    throw new CalculationError('SINGULAR_MATRIX', 'Matrix is singular and has no inverse')
  }
  const result = toArray(math.inv(toMathMatrix(M)))
  return result.map(row => row.map(v => (v === 0 ? 0 : v)))
}

export function vectorAdd(a: Vector, b: Vector): Vector {
  const A = parseVector(Array.isArray(a) ? a.join(',') : String(a))
  const B = parseVector(Array.isArray(b) ? b.join(',') : String(b))
  if (A.length !== B.length) {
    throw new CalculationError('INVALID_INPUT', `Dimension mismatch: vectors have lengths ${A.length} and ${B.length}`)
  }
  return A.map((v, i) => v + B[i])
}

export function vectorMagnitude(v: Vector): number {
  const V = parseVector(Array.isArray(v) ? v.join(',') : String(v))
  return Math.sqrt(V.reduce((s, x) => s + x * x, 0))
}

export function dotProduct(a: Vector, b: Vector): number {
  const A = parseVector(Array.isArray(a) ? a.join(',') : String(a))
  const B = parseVector(Array.isArray(b) ? b.join(',') : String(b))
  if (A.length !== B.length) {
    throw new CalculationError('INVALID_INPUT', `Dimension mismatch: vectors have lengths ${A.length} and ${B.length}`)
  }
  return A.reduce((s, x, i) => s + x * B[i], 0)
}

export function crossProduct(a: Vector, b: Vector): Vector {
  const A = parseVector(Array.isArray(a) ? a.join(',') : String(a))
  const B = parseVector(Array.isArray(b) ? b.join(',') : String(b))
  if (A.length !== 3 || B.length !== 3) {
    throw new CalculationError('INVALID_INPUT', 'Cross product requires 3D vectors')
  }
  return [
    A[1] * B[2] - A[2] * B[1],
    A[2] * B[0] - A[0] * B[2],
    A[0] * B[1] - A[1] * B[0],
  ]
}