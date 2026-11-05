import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import { heatTransfer, specificHeat, linearThermalExpansion, idealGasPressure, carnotEfficiency, latentHeat, thermalConductionRate, efficiency } from './thermodynamics'

describe('thermodynamics', () => {
  it('heat transfer', () => expect(heatTransfer(2, 4184, 10)).toBe(83680))
  it('specific heat', () => expect(specificHeat(83680, 2, 10)).toBe(4184))
  it('thermal expansion', () => expect(linearThermalExpansion(1, 0.000012, 10)).toBeCloseTo(0.00012, 8))
  it('ideal gas pressure', () => expect(idealGasPressure(1, 300, 0.024)).toBeCloseTo(103925, 0))
  it('carnot', () => expect(carnotEfficiency(300, 500)).toBeCloseTo(0.4, 6))
  it('latent heat', () => expect(latentHeat(2, 334000)).toBe(668000))
  it('conduction', () => expect(thermalConductionRate(0.5, 0.01, 10, 0.01)).toBe(5))
  it('efficiency', () => expect(efficiency(80, 100)).toBe(0.8))
  it('zero denominators', () => {
    expect(() => specificHeat(10, 0, 5)).toThrow(CalculationError)
    expect(() => idealGasPressure(1, 300, 0)).toThrow(CalculationError)
    expect(() => carnotEfficiency(300, 0)).toThrow(CalculationError)
  })
})
