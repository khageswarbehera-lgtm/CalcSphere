import { describe, expect, it } from 'vitest'

import { CalculationError } from './errors'

describe('CalculationError', () => {
  it('stores code, message and cause', () => {
    const cause = new Error('boom')
    const err = new CalculationError('PARSE_ERROR', 'bad', cause)
    expect(err.name).toBe('CalculationError')
    expect(err.code).toBe('PARSE_ERROR')
    expect(err.message).toBe('bad')
    expect(err.cause).toBe(cause)
  })

  it('is an Error instance', () => {
    const err = new CalculationError('INVALID_INPUT', 'x')
    expect(err).toBeInstanceOf(Error)
  })
})