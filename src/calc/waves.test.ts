import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import { waveSpeed, frequencyFromWaveSpeed, wavelengthFromWaveSpeed, period, soundIntensityLevel, dopplerFrequency, harmonicFrequency } from './waves'

describe('waves', () => {
  it('wave speed', () => expect(waveSpeed(10, 2)).toBe(20))
  it('frequency', () => expect(frequencyFromWaveSpeed(343, 0.5)).toBe(686))
  it('wavelength', () => expect(wavelengthFromWaveSpeed(343, 100)).toBeCloseTo(3.43, 2))
  it('period', () => expect(period(50)).toBe(0.02))
  it('sound level', () => expect(soundIntensityLevel(1e-6)).toBeCloseTo(60, 5))
  it('doppler', () => expect(dopplerFrequency(440, 343, 0, 0)).toBe(440))
  it('harmonic', () => expect(harmonicFrequency(100, 3)).toBe(300))
  it('zero denominators', () => {
    expect(() => frequencyFromWaveSpeed(10, 0)).toThrow(CalculationError)
    expect(() => wavelengthFromWaveSpeed(10, 0)).toThrow(CalculationError)
    expect(() => period(0)).toThrow(CalculationError)
  })
})
