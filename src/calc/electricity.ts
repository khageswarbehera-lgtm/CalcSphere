import { requireFinite, requireNonNegative, requirePositive } from './validation'
import { CalculationError } from './errors'

export interface HouseholdEnergyResult {
  wattage: number
  hoursPerDay: number
  days: number
  totalHours: number
  energyKWh: number
  tariff: number
  estimatedCost: number
  note: string
}

function toResistanceList(input: unknown): number[] {
  let raw: unknown[]
  if (Array.isArray(input)) raw = input
  else if (typeof input === 'string') raw = input.split(/[,\s;]+/).filter(t => t.trim() !== '')
  else throw new CalculationError('INVALID_INPUT', 'Resistances must be an array or comma-separated string')
  if (raw.length === 0) throw new CalculationError('INVALID_INPUT', 'At least one resistance is required')
  return raw.map((v, i) => {
    const n = requireFinite(v, `resistance[${i}]`)
    if (n < 0) throw new CalculationError('INVALID_INPUT', 'Resistance must be non-negative')
    return n
  })
}

function toCapacitanceList(input: unknown): number[] {
  let raw: unknown[]
  if (Array.isArray(input)) raw = input
  else if (typeof input === 'string') raw = input.split(/[,\s;]+/).filter(t => t.trim() !== '')
  else throw new CalculationError('INVALID_INPUT', 'Capacitances must be an array or comma-separated string')
  if (raw.length === 0) throw new CalculationError('INVALID_INPUT', 'At least one capacitance is required')
  return raw.map((v, i) => {
    const n = requireFinite(v, `capacitance[${i}]`)
    if (n < 0) throw new CalculationError('INVALID_INPUT', 'Capacitance must be non-negative')
    return n
  })
}

export function ohmsVoltage(current: unknown, resistance: unknown): number {
  const i = requireFinite(current, 'current')
  const r = requireFinite(resistance, 'resistance')
  return i * r
}

export function ohmsCurrent(voltage: unknown, resistance: unknown): number {
  const v = requireFinite(voltage, 'voltage')
  const r = requireFinite(resistance, 'resistance')
  if (r === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Resistance must not be zero')
  return v / r
}

export function ohmsResistance(voltage: unknown, current: unknown): number {
  const v = requireFinite(voltage, 'voltage')
  const i = requireFinite(current, 'current')
  if (i === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Current must not be zero')
  return v / i
}

export function electricalPower(voltage: unknown, current: unknown): number {
  return requireFinite(voltage, 'voltage') * requireFinite(current, 'current')
}

export function powerFromCurrentResistance(current: unknown, resistance: unknown): number {
  const i = requireFinite(current, 'current')
  const r = requireFinite(resistance, 'resistance')
  return i * i * r
}

export function powerFromVoltageResistance(voltage: unknown, resistance: unknown): number {
  const v = requireFinite(voltage, 'voltage')
  const r = requireFinite(resistance, 'resistance')
  if (r === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Resistance must not be zero')
  return (v * v) / r
}
export function energyKilowattHours(powerWatts: unknown, hours: unknown): number {
  const p = requireFinite(powerWatts, 'power')
  const h = requireFinite(hours, 'hours')
  if (h < 0) throw new CalculationError('INVALID_INPUT', 'hours must be non-negative')
  return (p * h) / 1000
}

export function energyCost(powerWatts: unknown, hours: unknown, tariff: unknown): number {
  const kwh = energyKilowattHours(powerWatts, hours)
  const t = requireFinite(tariff, 'tariff')
  if (t < 0) throw new CalculationError('INVALID_INPUT', 'tariff must be non-negative')
  return kwh * t
}

export function householdEnergyEstimate(
  wattage: unknown,
  hoursPerDay: unknown,
  tariff: unknown,
  days = 30,
): HouseholdEnergyResult {
  const w = requireFinite(wattage, 'wattage')
  const h = requireFinite(hoursPerDay, 'hours per day')
  const t = requireFinite(tariff, 'tariff')
  const d = requireFinite(days, 'days')
  if (w < 0) throw new CalculationError('INVALID_INPUT', 'wattage must be non-negative')
  if (h < 0 || h > 24) throw new CalculationError('INVALID_INPUT', 'hours per day must be between 0 and 24')
  if (t < 0) throw new CalculationError('INVALID_INPUT', 'tariff must be non-negative')
  if (d < 0) throw new CalculationError('INVALID_INPUT', 'days must be non-negative')
  const dailyKWh = energyKilowattHours(w, h)
  const totalHours = h * d
  const energyKWh = energyKilowattHours(w, totalHours)
  return {
    wattage: w,
    hoursPerDay: h,
    days: d,
    totalHours,
    energyKWh,
    tariff: t,
    estimatedCost: energyKWh * t,
    note: 'Estimate based on entered wattage, usage hours and tariff; assumes constant power and ideal metering.',
  }
}

export function chargeFromCurrentTime(current: unknown, time: unknown): number {
  return requireFinite(current, 'current') * requireFinite(time, 'time')
}

export function currentFromChargeTime(charge: unknown, time: unknown): number {
  const q = requireFinite(charge, 'charge')
  const t = requireFinite(time, 'time')
  if (t === 0) throw new CalculationError('DIVISION_BY_ZERO', 'time must not be zero')
  return q / t
}

export function timeFromChargeCurrent(charge: unknown, current: unknown): number {
  const q = requireFinite(charge, 'charge')
  const i = requireFinite(current, 'current')
  if (i === 0) throw new CalculationError('DIVISION_BY_ZERO', 'current must not be zero')
  return q / i
}

export function seriesResistance(input: unknown): number {
  const values = toResistanceList(input)
  return values.reduce((sum, r) => sum + r, 0)
}

export function parallelResistance(input: unknown): number {
  const values = toResistanceList(input)
  if (values.some(r => r === 0)) return 0
  const reciprocal = values.reduce((sum, r) => sum + 1 / r, 0)
  if (reciprocal === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Parallel resistance is undefined')
  return 1 / reciprocal
}

export function capacitance(charge: unknown, voltage: unknown): number {
  const q = requireFinite(charge, 'charge')
  const v = requireFinite(voltage, 'voltage')
  if (v === 0) throw new CalculationError('DIVISION_BY_ZERO', 'voltage must not be zero')
  return q / v
}

export function chargeFromCapacitanceVoltage(capacitanceValue: unknown, voltage: unknown): number {
  return requireFinite(capacitanceValue, 'capacitance') * requireFinite(voltage, 'voltage')
}

export function voltageFromCapacitanceCharge(capacitanceValue: unknown, charge: unknown): number {
  const c = requireFinite(capacitanceValue, 'capacitance')
  const q = requireFinite(charge, 'charge')
  if (c === 0) throw new CalculationError('DIVISION_BY_ZERO', 'capacitance must not be zero')
  return q / c
}

export function capacitorEnergy(capacitanceValue: unknown, voltage: unknown): number {
  const c = requireFinite(capacitanceValue, 'capacitance')
  const v = requireFinite(voltage, 'voltage')
  return 0.5 * c * v * v
}

export function seriesCapacitance(input: unknown): number {
  const values = toCapacitanceList(input)
  if (values.some(c => c === 0)) return 0
  const reciprocal = values.reduce((sum, c) => sum + 1 / c, 0)
  if (reciprocal === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Series capacitance is undefined')
  return 1 / reciprocal
}

export function parallelCapacitance(input: unknown): number {
  const values = toCapacitanceList(input)
  return values.reduce((sum, c) => sum + c, 0)
}

export function inductorEnergy(inductance: unknown, current: unknown): number {
  const l = requireFinite(inductance, 'inductance')
  const i = requireFinite(current, 'current')
  if (l < 0) throw new CalculationError('INVALID_INPUT', 'inductance must be non-negative')
  return 0.5 * l * i * i
}

export function inductiveReactance(frequency: unknown, inductance: unknown): number {
  const f = requireFinite(frequency, 'frequency')
  const l = requireFinite(inductance, 'inductance')
  if (f < 0) throw new CalculationError('INVALID_INPUT', 'frequency must be non-negative')
  if (l < 0) throw new CalculationError('INVALID_INPUT', 'inductance must be non-negative')
  return 2 * Math.PI * f * l
}

export function capacitiveReactance(frequency: unknown, capacitanceValue: unknown): number {
  const f = requireFinite(frequency, 'frequency')
  const c = requireFinite(capacitanceValue, 'capacitance')
  if (f <= 0) throw new CalculationError('INVALID_INPUT', 'frequency must be positive')
  if (c <= 0) throw new CalculationError('INVALID_INPUT', 'capacitance must be positive')
  return 1 / (2 * Math.PI * f * c)
}

export function impedanceSeriesRLC(resistance: unknown, inductance: unknown, capacitanceValue: unknown, frequency: unknown): number {
  const r = requireFinite(resistance, 'resistance')
  const xl = inductiveReactance(frequency, inductance)
  const xc = capacitiveReactance(frequency, capacitanceValue)
  return Math.sqrt(r * r + (xl - xc) ** 2)
}

export function transformerVoltage(primaryVoltage: unknown, primaryTurns: unknown, secondaryTurns: unknown): number {
  const vp = requireFinite(primaryVoltage, 'primary voltage')
  const np = requireFinite(primaryTurns, 'primary turns')
  const ns = requireFinite(secondaryTurns, 'secondary turns')
  if (np === 0) throw new CalculationError('DIVISION_BY_ZERO', 'primary turns must not be zero')
  return vp * (ns / np)
}

// Aliases
export const voltage = ohmsVoltage
export const current = ohmsCurrent
export const resistance = ohmsResistance
export const electricPower = electricalPower
export const powerVI = electricalPower
export const powerI2R = powerFromCurrentResistance
export const powerV2R = powerFromVoltageResistance
export const energyKWh = energyKilowattHours
export const kwh = energyKilowattHours
export const energyCostEstimate = householdEnergyEstimate
export const householdEnergyCost = householdEnergyEstimate
export const charge = chargeFromCurrentTime
export const seriesR = seriesResistance
export const parallelR = parallelResistance
export const seriesC = seriesCapacitance
export const parallelC = parallelCapacitance
export const capacitorStoredEnergy = capacitorEnergy
export const inductorStoredEnergy = inductorEnergy
export const xl = inductiveReactance
export const xc = capacitiveReactance
export const impedance = impedanceSeriesRLC
export const seriesResistanceTotal = seriesResistance
export const parallelResistanceTotal = parallelResistance

