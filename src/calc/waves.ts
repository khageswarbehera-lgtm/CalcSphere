import { requireFinite, requirePositive } from './validation'
import { CalculationError } from './errors'

export function waveSpeed(frequency: unknown, wavelength: unknown): number {
  return requireFinite(frequency, 'frequency') * requireFinite(wavelength, 'wavelength')
}

export function frequencyFromWaveSpeed(waveSpeedValue: unknown, wavelength: unknown): number {
  const v = requireFinite(waveSpeedValue, 'wave speed')
  const lambda = requireFinite(wavelength, 'wavelength')
  if (lambda === 0) throw new CalculationError('DIVISION_BY_ZERO', 'wavelength must not be zero')
  return v / lambda
}

export function wavelengthFromWaveSpeed(waveSpeedValue: unknown, frequency: unknown): number {
  const v = requireFinite(waveSpeedValue, 'wave speed')
  const f = requireFinite(frequency, 'frequency')
  if (f === 0) throw new CalculationError('DIVISION_BY_ZERO', 'frequency must not be zero')
  return v / f
}

export function period(frequency: unknown): number {
  const f = requireFinite(frequency, 'frequency')
  if (f === 0) throw new CalculationError('DIVISION_BY_ZERO', 'frequency must not be zero')
  return 1 / f
}

export function frequencyFromPeriod(periodValue: unknown): number {
  const t = requireFinite(periodValue, 'period')
  if (t === 0) throw new CalculationError('DIVISION_BY_ZERO', 'period must not be zero')
  return 1 / t
}

export function waveNumber(wavelength: unknown): number {
  const lambda = requireFinite(wavelength, 'wavelength')
  if (lambda === 0) throw new CalculationError('DIVISION_BY_ZERO', 'wavelength must not be zero')
  return (2 * Math.PI) / lambda
}

export function soundIntensityLevel(intensity: unknown, referenceIntensity = 1e-12): number {
  const i = requireFinite(intensity, 'intensity')
  const i0 = requireFinite(referenceIntensity, 'reference intensity')
  if (i < 0 || i0 <= 0) throw new CalculationError('INVALID_INPUT', 'intensities must be positive')
  if (i === 0) return -Infinity
  return 10 * Math.log10(i / i0)
}

export function dopplerFrequency(sourceFrequency: unknown, waveSpeedValue: unknown, observerSpeed: unknown, sourceSpeed: unknown): number {
  const f = requireFinite(sourceFrequency, 'source frequency')
  const v = requireFinite(waveSpeedValue, 'wave speed')
  const vo = requireFinite(observerSpeed, 'observer speed')
  const vs = requireFinite(sourceSpeed, 'source speed')
  if (v - vs === 0) throw new CalculationError('DIVISION_BY_ZERO', 'source speed must not equal wave speed')
  return f * (v + vo) / (v - vs)
}

export function harmonicFrequency(fundamental: unknown, harmonicNumber: unknown): number {
  const f1 = requireFinite(fundamental, 'fundamental frequency')
  const n = requireFinite(harmonicNumber, 'harmonic number')
  if (!Number.isInteger(n) || n < 1) throw new CalculationError('INVALID_INPUT', 'harmonic number must be a positive integer')
  return n * f1
}
