import { describe, expect, it } from 'vitest'

import {
  crossProduct,
  determinant,
  dotProduct,
  inverse,
  matrixAdd,
  matrixMultiply,
  matrixSubtract,
  parseMatrix,
  parseVector,
  transpose,
  vectorAdd,
  vectorMagnitude,
} from './matrix'
import { CalculationError } from './errors'

describe('matrix/vector', () => {
  it('addition', () => {
    expect(matrixAdd([[1, 2], [3, 4]], [[5, 6], [7, 8]])).toEqual([[6, 8], [10, 12]])
  })

  it('subtraction dimension mismatch', () => {
    expect(() => matrixSubtract([[1, 2]], [[1], [2]])).toThrow(CalculationError)
  })

  it('multiplication', () => {
    expect(matrixMultiply([[1, 2], [3, 4]], [[2, 0], [1, 2]])).toEqual([[4, 4], [10, 8]])
  })

  it('multiplication dimension mismatch', () => {
    expect(() => matrixMultiply([[1, 2]], [[1, 2]])).toThrow(CalculationError)
  })

  it('transpose', () => {
    expect(transpose([[1, 2], [3, 4]])).toEqual([[1, 3], [2, 4]])
  })

  it('determinant identity', () => {
    expect(determinant([[1, 0], [0, 1]])).toBe(1)
  })

  it('determinant non-square throws', () => {
    expect(() => determinant([[1, 2, 3], [4, 5, 6]])).toThrow(CalculationError)
  })

  it('inverse identity', () => {
    expect(inverse([[1, 0], [0, 1]])).toEqual([[1, 0], [0, 1]])
  })

  it('inverse singular throws', () => {
    expect(() => inverse([[1, 2], [2, 4]])).toThrow(CalculationError)
  })

  it('known inverse', () => {
    const inv = inverse([[4, 7], [2, 6]])
    expect(inv[0][0]).toBeCloseTo(0.6, 5)
    expect(inv[0][1]).toBeCloseTo(-0.7, 5)
  })

  it('vector add', () => {
    expect(vectorAdd([1, 2, 3], [4, 5, 6])).toEqual([5, 7, 9])
  })

  it('vector magnitude zero', () => {
    expect(vectorMagnitude([0, 0, 0])).toBe(0)
  })

  it('vector magnitude known', () => {
    expect(vectorMagnitude([3, 4, 0])).toBe(5)
  })

  it('dot product', () => {
    expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(32)
  })

  it('dot product dimension mismatch', () => {
    expect(() => dotProduct([1, 2], [1, 2, 3])).toThrow(CalculationError)
  })

  it('cross product', () => {
    expect(crossProduct([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1])
  })

  it('cross product non-3d throws', () => {
    expect(() => crossProduct([1, 2], [3, 4])).toThrow(CalculationError)
  })

  it('parseMatrix', () => {
    expect(parseMatrix('1 2\n3 4')).toEqual([[1, 2], [3, 4]])
  })

  it('parseVector', () => {
    expect(parseVector('1, 2, 3')).toEqual([1, 2, 3])
  })
})