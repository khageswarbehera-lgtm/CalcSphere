import { describe, expect, it } from 'vitest'

import { evaluateScientificValue } from './scientific'
import { formatDecimalResult, getExactResult } from './exactResults'

describe('exact result recognition', () => {
  it.each([
    ['sin(30)', '1/2', '0.5'],
    ['cos(60)', '1/2', '0.5'],
    ['sin(60)', '√3/2', '0.8660254'],
    ['cos(30)', '√3/2', '0.8660254'],
    ['tan(45)', '1', '1'],
    ['sqrt(2)', '√2', '1.41421356'],
    ['sqrt(3)', '√3', '1.73205081'],
  ])('recognizes %s in degree mode', (expression, exact, decimal) => {
    const value = evaluateScientificValue(expression, { angleMode: 'deg' })
    expect(getExactResult(expression, value, { angleMode: 'deg' })).toBe(exact)
    expect(formatDecimalResult(value)).toBe(decimal)
  })

  it('does not present a degree-mode value as exact in radians', () => {
    const value = evaluateScientificValue('sin(30)', { angleMode: 'rad' })
    expect(getExactResult('sin(30)', value, { angleMode: 'rad' })).toBeUndefined()
    expect(formatDecimalResult(value)).toBe('-0.98803162')
  })

  it('keeps exact constants and integer inverse-angle results', () => {
    expect(getExactResult('pi', Math.PI)).toBe('π')
    const inverseAngle = evaluateScientificValue('asin(1)', { angleMode: 'deg' })
    expect(getExactResult('asin(1)', inverseAngle, { angleMode: 'deg' })).toBe('90')
  })
})
