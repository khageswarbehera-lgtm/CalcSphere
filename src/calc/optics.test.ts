import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import { lensImageDistance, magnification, snellAngle, criticalAngle, lensPower, refractiveIndex } from './optics'

describe('optics', () => {
  it('lens image distance', () => expect(lensImageDistance(10, 30)).toBeCloseTo(15, 6))
  it('magnification', () => expect(magnification(15, 30)).toBe(-0.5))
  it('snell', () => expect(snellAngle(30, 1, 1.5)).toBeCloseTo(19.47, 2))
  it('critical angle', () => expect(criticalAngle(1.5, 1)).toBeCloseTo(41.81, 2))
  it('lens power', () => expect(lensPower(0.5)).toBe(2))
  it('refractive index', () => expect(refractiveIndex(2e8)).toBeCloseTo(1.499, 3))
  it('zero denominators', () => {
    expect(() => lensImageDistance(10, 0)).toThrow(CalculationError)
    expect(() => magnification(10, 0)).toThrow(CalculationError)
    expect(() => lensPower(0)).toThrow(CalculationError)
  })
  it('total internal reflection', () => {
    expect(() => snellAngle(60, 1.5, 1)).toThrow(CalculationError)
  })
})
