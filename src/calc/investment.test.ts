import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import {
  lumpSumFutureValue,
  lumpSumGrowth,
  sipFutureValue,
  sipGrowth,
  sipInvestedAmount,
  sipScenarios,
} from './investment'

describe('investment', () => {
  it('lump sum known example', () => {
    expect(lumpSumFutureValue(1000, 10, 2)).toBeCloseTo(1210, 5)
  })

  it('lump sum growth', () => {
    expect(lumpSumGrowth(1000, 10, 2)).toBeCloseTo(210, 5)
  })

  it('sip known example', () => {
    expect(sipFutureValue(1000, 12, 1, 12, 'end')).toBeCloseTo(12682.5, 1)
  })

  it('sip invested amount', () => {
    expect(sipInvestedAmount(1000, 1, 12)).toBe(12000)
  })

  it('sip growth', () => {
    expect(sipGrowth(1000, 12, 1, 12, 'end')).toBeCloseTo(682.5, 1)
  })

  it('zero return', () => {
    expect(lumpSumFutureValue(1000, 0, 5)).toBe(1000)
    expect(sipFutureValue(1000, 0, 1, 12, 'end')).toBe(12000)
    expect(sipGrowth(1000, 0, 1, 12, 'end')).toBe(0)
  })

  it('short tenure', () => {
    expect(sipFutureValue(1000, 12, 1 / 12, 12, 'end')).toBeCloseTo(1000, 5)
    expect(lumpSumFutureValue(1000, 5, 1 / 12)).toBeCloseTo(1004.07, 2)
  })

  it('beginning timing increases value', () => {
    const end = sipFutureValue(1000, 12, 1, 12, 'end')
    const begin = sipFutureValue(1000, 12, 1, 12, 'beginning')
    expect(begin).toBeGreaterThan(end)
  })

  it('scenarios', () => {
    const scenarios = sipScenarios(1000, 1, [8, 12])
    expect(scenarios.length).toBe(2)
    expect(scenarios[0].estimatedGrowth).toBeLessThan(scenarios[1].estimatedGrowth)
  })

  it('validation', () => {
    expect(() => lumpSumFutureValue(0, 10, 2)).toThrow(CalculationError)
    expect(() => lumpSumFutureValue(1000, -1, 2)).toThrow(CalculationError)
    expect(() => lumpSumFutureValue(1000, 10, 0)).toThrow(CalculationError)
    expect(() => sipFutureValue(0, 10, 2, 12)).toThrow(CalculationError)
    expect(() => sipFutureValue(1000, 10, 2, 0)).toThrow(CalculationError)
  })
})
