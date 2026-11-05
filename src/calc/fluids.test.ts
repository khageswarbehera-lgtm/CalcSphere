import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import { hydrostaticPressure, buoyantForce, volumeFlowRate, continuityVelocity, reynoldsNumber, dynamicPressure, bernoulliPressure2 } from './fluids'

describe('fluids', () => {
  it('hydrostatic pressure', () => expect(hydrostaticPressure(1000, 9.8, 2)).toBe(19600))
  it('buoyant force', () => expect(buoyantForce(1000, 0.01, 9.8)).toBe(98))
  it('flow rate', () => expect(volumeFlowRate(0.01, 2)).toBe(0.02))
  it('continuity', () => expect(continuityVelocity(0.02, 3, 0.01)).toBe(6))
  it('reynolds', () => expect(reynoldsNumber(1000, 2, 0.05, 0.001)).toBe(100000))
  it('dynamic pressure', () => expect(dynamicPressure(1000, 2)).toBe(2000))
  it('bernoulli', () => expect(bernoulliPressure2(100000, 1000, 2, 1, 3, 0)).toBeCloseTo(107300, 0))
  it('zero denominators', () => {
    expect(() => continuityVelocity(1, 2, 0)).toThrow(CalculationError)
    expect(() => reynoldsNumber(1, 2, 3, 0)).toThrow(CalculationError)
  })
})
