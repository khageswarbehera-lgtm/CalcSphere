import { describe, expect, it } from 'vitest'

import {
  capacitiveReactance,
  capacitorEnergy,
  chargeFromCurrentTime,
  electricalPower,
  energyCost,
  energyKilowattHours,
  householdEnergyEstimate,
  impedance,
  inductiveReactance,
  inductorEnergy,
  ohmsCurrent,
  ohmsResistance,
  ohmsVoltage,
  parallelResistance,
  seriesResistance,
  transformerVoltage,
} from './electricity'
import { CalculationError } from './errors'

describe('electricity', () => {
  it('ohms law', () => {
    expect(ohmsVoltage(3, 4)).toBe(12)
    expect(ohmsCurrent(12, 4)).toBe(3)
    expect(ohmsResistance(12, 3)).toBe(4)
  })

  it('power', () => {
    expect(electricalPower(12, 3)).toBe(36)
  })

  it('energy kWh', () => {
    expect(energyKilowattHours(1000, 2)).toBe(2)
  })

  it('energy cost', () => {
    expect(energyCost(1000, 2, 5)).toBe(10)
  })

  it('household estimate', () => {
    const r = householdEnergyEstimate(1000, 2, 5, 30)
    expect(r.energyKWh).toBe(60)
    expect(r.estimatedCost).toBe(300)
  })

  it('series resistance', () => {
    expect(seriesResistance([2, 3, 4])).toBe(9)
    expect(seriesResistance('2, 3, 4')).toBe(9)
  })

  it('parallel resistance', () => {
    expect(parallelResistance([2, 3])).toBeCloseTo(1.2, 6)
  })

  it('charge', () => {
    expect(chargeFromCurrentTime(2, 5)).toBe(10)
  })

  it('capacitor energy', () => {
    expect(capacitorEnergy(0.000001, 10)).toBeCloseTo(0.00005, 8)
  })

  it('inductor energy', () => {
    expect(inductorEnergy(0.1, 2)).toBe(0.2)
  })

  it('reactance and impedance', () => {
    expect(inductiveReactance(50, 0.1)).toBeCloseTo(31.4159, 3)
    expect(capacitiveReactance(50, 0.000001)).toBeCloseTo(3183.1, 1)
    expect(impedance(4, 0.1, 0.000001, 50)).toBeGreaterThan(0)
  })

  it('transformer', () => {
    expect(transformerVoltage(230, 100, 50)).toBe(115)
  })

  it('validation', () => {
    expect(() => ohmsCurrent(12, 0)).toThrow(CalculationError)
    expect(() => ohmsResistance(12, 0)).toThrow(CalculationError)
    expect(() => householdEnergyEstimate(1000, 25, 5)).toThrow(CalculationError)
    expect(() => seriesResistance([])).toThrow(CalculationError)
  })
})
