import { requireFinite, requirePositive } from './validation'
import { CalculationError } from './errors'

export function heatTransfer(mass: unknown, specificHeat: unknown, temperatureChange: unknown): number {
  return requireFinite(mass, 'mass') * requireFinite(specificHeat, 'specific heat') * requireFinite(temperatureChange, 'temperature change')
}

export function specificHeat(heat: unknown, mass: unknown, temperatureChange: unknown): number {
  const m = requireFinite(mass, 'mass')
  const dt = requireFinite(temperatureChange, 'temperature change')
  if (m === 0 || dt === 0) throw new CalculationError('DIVISION_BY_ZERO', 'mass and temperature change must not be zero')
  return requireFinite(heat, 'heat') / (m * dt)
}

export function temperatureChange(heat: unknown, mass: unknown, specificHeatValue: unknown): number {
  const m = requireFinite(mass, 'mass')
  const c = requireFinite(specificHeatValue, 'specific heat')
  if (m === 0 || c === 0) throw new CalculationError('DIVISION_BY_ZERO', 'mass and specific heat must not be zero')
  return requireFinite(heat, 'heat') / (m * c)
}

export function linearThermalExpansion(initialLength: unknown, coefficient: unknown, temperatureChange: unknown): number {
  return requireFinite(initialLength, 'initial length') * requireFinite(coefficient, 'coefficient') * requireFinite(temperatureChange, 'temperature change')
}

export function idealGasPressure(moles: unknown, temperature: unknown, volume: unknown, gasConstant = 8.314): number {
  const n = requireFinite(moles, 'moles')
  const t = requireFinite(temperature, 'temperature')
  const v = requireFinite(volume, 'volume')
  if (v === 0) throw new CalculationError('DIVISION_BY_ZERO', 'volume must not be zero')
  return (n * gasConstant * t) / v
}

export function idealGasVolume(moles: unknown, temperature: unknown, pressure: unknown, gasConstant = 8.314): number {
  const n = requireFinite(moles, 'moles')
  const t = requireFinite(temperature, 'temperature')
  const p = requireFinite(pressure, 'pressure')
  if (p === 0) throw new CalculationError('DIVISION_BY_ZERO', 'pressure must not be zero')
  return (n * gasConstant * t) / p
}

export function idealGasTemperature(pressure: unknown, volume: unknown, moles: unknown, gasConstant = 8.314): number {
  const p = requireFinite(pressure, 'pressure')
  const v = requireFinite(volume, 'volume')
  const n = requireFinite(moles, 'moles')
  if (n === 0 || gasConstant === 0) throw new CalculationError('DIVISION_BY_ZERO', 'moles and gas constant must not be zero')
  return (p * v) / (n * gasConstant)
}

export function idealGasMoles(pressure: unknown, volume: unknown, temperature: unknown, gasConstant = 8.314): number {
  const p = requireFinite(pressure, 'pressure')
  const v = requireFinite(volume, 'volume')
  const t = requireFinite(temperature, 'temperature')
  if (t === 0 || gasConstant === 0) throw new CalculationError('DIVISION_BY_ZERO', 'temperature and gas constant must not be zero')
  return (p * v) / (gasConstant * t)
}

export function carnotEfficiency(coldTemperature: unknown, hotTemperature: unknown): number {
  const tc = requireFinite(coldTemperature, 'cold temperature')
  const th = requireFinite(hotTemperature, 'hot temperature')
  if (th === 0) throw new CalculationError('DIVISION_BY_ZERO', 'hot temperature must not be zero')
  if (tc < 0 || th <= tc) throw new CalculationError('INVALID_INPUT', 'temperatures must be in Kelvin with hot > cold')
  return 1 - (tc / th)
}

export function latentHeat(mass: unknown, latentHeatValue: unknown): number {
  return requireFinite(mass, 'mass') * requireFinite(latentHeatValue, 'latent heat')
}

export function thermalConductionRate(thermalConductivity: unknown, area: unknown, temperatureDifference: unknown, thickness: unknown): number {
  const k = requireFinite(thermalConductivity, 'thermal conductivity')
  const a = requireFinite(area, 'area')
  const dt = requireFinite(temperatureDifference, 'temperature difference')
  const d = requireFinite(thickness, 'thickness')
  if (d === 0) throw new CalculationError('DIVISION_BY_ZERO', 'thickness must not be zero')
  return (k * a * dt) / d
}

export function efficiency(usefulOutput: unknown, totalInput: unknown): number {
  const input = requireFinite(totalInput, 'total input')
  if (input === 0) throw new CalculationError('DIVISION_BY_ZERO', 'total input must not be zero')
  return requireFinite(usefulOutput, 'useful output') / input
}
