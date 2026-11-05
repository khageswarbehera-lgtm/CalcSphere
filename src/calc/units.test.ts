import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import { areCompatible, convertUnit, getUnit } from './units'

describe('unit converter', () => {
  it('round trip', () => {
    const cm = convertUnit(5, 'm', 'cm')
    expect(convertUnit(cm, 'cm', 'm')).toBeCloseTo(5, 6)
  })

  it('temperature offsets', () => {
    expect(convertUnit(0, 'C', 'F')).toBe(32)
    expect(convertUnit(0, 'C', 'K')).toBe(273.15)
    expect(convertUnit(32, 'F', 'C')).toBe(0)
    expect(convertUnit(212, 'F', 'C')).toBe(100)
  })

  it('known constants', () => {
    expect(convertUnit(1, 'atm', 'Pa')).toBe(101325)
    expect(convertUnit(1, 'in', 'm')).toBe(0.0254)
    expect(convertUnit(1, 'hp', 'W')).toBeCloseTo(745.6998715822702, 6)
    expect(convertUnit(1, 'kWh', 'J')).toBe(3600000)
  })

  it('invalid combinations', () => {
    expect(() => convertUnit(1, 'm', 'kg')).toThrow(CalculationError)
    expect(() => convertUnit(1, 'V', 'A')).toThrow(CalculationError)
    expect(areCompatible('m', 'kg')).toBe(false)
  })

  it('unknown unit', () => {
    expect(() => convertUnit(1, 'foo', 'm')).toThrow(CalculationError)
    expect(getUnit('m')).toBeDefined()
  })
})
