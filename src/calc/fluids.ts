import { requireFinite, requirePositive } from './validation'
import { CalculationError } from './errors'

export function hydrostaticPressure(fluidDensity: unknown, gravity: unknown, height: unknown): number {
  return requireFinite(fluidDensity, 'fluid density') * requireFinite(gravity, 'gravity') * requireFinite(height, 'height')
}

export function absolutePressure(gaugePressure: unknown, atmosphericPressure: unknown): number {
  return requireFinite(gaugePressure, 'gauge pressure') + requireFinite(atmosphericPressure, 'atmospheric pressure')
}

export function buoyantForce(fluidDensity: unknown, volumeDisplaced: unknown, gravity: unknown): number {
  return requireFinite(fluidDensity, 'fluid density') * requireFinite(volumeDisplaced, 'volume displaced') * requireFinite(gravity, 'gravity')
}

export function volumeFlowRate(area: unknown, velocity: unknown): number {
  return requireFinite(area, 'area') * requireFinite(velocity, 'velocity')
}

export function continuityVelocity(area1: unknown, velocity1: unknown, area2: unknown): number {
  const a1 = requireFinite(area1, 'area1')
  const v1 = requireFinite(velocity1, 'velocity1')
  const a2 = requireFinite(area2, 'area2')
  if (a2 === 0) throw new CalculationError('DIVISION_BY_ZERO', 'area2 must not be zero')
  return (a1 * v1) / a2
}

export function bernoulliPressure2(pressure1: unknown, density: unknown, velocity1: unknown, height1: unknown, velocity2: unknown, height2: unknown, gravity = 9.8): number {
  const p1 = requireFinite(pressure1, 'pressure1')
  const rho = requireFinite(density, 'density')
  const v1 = requireFinite(velocity1, 'velocity1')
  const h1 = requireFinite(height1, 'height1')
  const v2 = requireFinite(velocity2, 'velocity2')
  const h2 = requireFinite(height2, 'height2')
  const g = requireFinite(gravity, 'gravity')
  return p1 + 0.5 * rho * (v1 * v1 - v2 * v2) + rho * g * (h1 - h2)
}

export function reynoldsNumber(density: unknown, velocity: unknown, diameter: unknown, viscosity: unknown): number {
  const rho = requireFinite(density, 'density')
  const v = requireFinite(velocity, 'velocity')
  const d = requireFinite(diameter, 'diameter')
  const mu = requireFinite(viscosity, 'viscosity')
  if (mu === 0) throw new CalculationError('DIVISION_BY_ZERO', 'viscosity must not be zero')
  return (rho * v * d) / mu
}

export function dynamicPressure(density: unknown, velocity: unknown): number {
  return 0.5 * requireFinite(density, 'density') * requireFinite(velocity, 'velocity') ** 2
}

export function pressureFromForceArea(forceValue: unknown, area: unknown): number {
  const f = requireFinite(forceValue, 'force')
  const a = requireFinite(area, 'area')
  if (a === 0) throw new CalculationError('DIVISION_BY_ZERO', 'area must not be zero')
  return f / a
}
