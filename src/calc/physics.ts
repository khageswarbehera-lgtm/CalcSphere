import { requireFinite } from './validation'
import { CalculationError } from './errors'

function nonzero(value: number, name: string): number {
  const n = requireFinite(value, name)
  if (n === 0) throw new CalculationError('DIVISION_BY_ZERO', `${name} must not be zero`)
  return n
}

export function force(mass: number, acceleration: number): number {
  return requireFinite(mass, 'mass') * requireFinite(acceleration, 'acceleration')
}

export function massFromForce(forceValue: number, acceleration: number): number {
  return requireFinite(forceValue, 'force') / nonzero(acceleration, 'acceleration')
}

export function accelerationFromForce(forceValue: number, mass: number): number {
  return requireFinite(forceValue, 'force') / nonzero(mass, 'mass')
}

export function momentum(mass: number, velocity: number): number {
  return requireFinite(mass, 'mass') * requireFinite(velocity, 'velocity')
}

export function impulse(forceValue: number, time: number): number {
  return requireFinite(forceValue, 'force') * requireFinite(time, 'time')
}

export function impulseMomentum(mass: number, velocityChange: number): number {
  return requireFinite(mass, 'mass') * requireFinite(velocityChange, 'velocity change')
}

export function work(forceValue: number, distance: number, angleDegrees = 0): number {
  const f = requireFinite(forceValue, 'force')
  const d = requireFinite(distance, 'distance')
  const angle = requireFinite(angleDegrees, 'angle')
  const radians = (angle * Math.PI) / 180
  return f * d * Math.cos(radians)
}

export function kineticEnergy(mass: number, velocity: number): number {
  const m = requireFinite(mass, 'mass')
  const v = requireFinite(velocity, 'velocity')
  return 0.5 * m * v ** 2
}

export function gravitationalPotentialEnergy(mass: number, height: number, gravity = 9.8): number {
  return requireFinite(mass, 'mass') * requireFinite(gravity, 'gravity') * requireFinite(height, 'height')
}

export function power(workValue: number, time: number): number {
  return requireFinite(workValue, 'work') / nonzero(time, 'time')
}

export function powerFromForceVelocity(forceValue: number, velocity: number): number {
  return requireFinite(forceValue, 'force') * requireFinite(velocity, 'velocity')
}

export function density(mass: number, volume: number): number {
  return requireFinite(mass, 'mass') / nonzero(volume, 'volume')
}

export function pressure(forceValue: number, area: number): number {
  return requireFinite(forceValue, 'force') / nonzero(area, 'area')
}

export function speed(distanceValue: number, time: number): number {
  return requireFinite(distanceValue, 'distance') / nonzero(time, 'time')
}

export function velocity(displacementValue: number, time: number): number {
  return requireFinite(displacementValue, 'displacement') / nonzero(time, 'time')
}

export function displacement(velocityValue: number, time: number): number {
  return requireFinite(velocityValue, 'velocity') * requireFinite(time, 'time')
}

export function acceleration(finalVelocity: number, initialVelocity: number, time: number): number {
  return (requireFinite(finalVelocity, 'final velocity') - requireFinite(initialVelocity, 'initial velocity')) / nonzero(time, 'time')
}

export function distanceFromSpeed(speedValue: number, time: number): number {
  return requireFinite(speedValue, 'speed') * requireFinite(time, 'time')
}

export function timeFromDistanceSpeed(distanceValue: number, speedValue: number): number {
  return requireFinite(distanceValue, 'distance') / nonzero(speedValue, 'speed')
}

export function distanceFromAcceleration(initialVelocity: number, time: number, accelerationValue: number): number {
  const u = requireFinite(initialVelocity, 'initial velocity')
  const t = requireFinite(time, 'time')
  const a = requireFinite(accelerationValue, 'acceleration')
  return u * t + 0.5 * a * t ** 2
}

export function finalVelocity(initialVelocity: number, accelerationValue: number, time: number): number {
  return requireFinite(initialVelocity, 'initial velocity') + requireFinite(accelerationValue, 'acceleration') * requireFinite(time, 'time')
}

export function centripetalForce(mass: number, velocityValue: number, radius: number): number {
  const m = requireFinite(mass, 'mass')
  const v = requireFinite(velocityValue, 'velocity')
  const r = nonzero(radius, 'radius')
  return (m * v ** 2) / r
}

export function centripetalAcceleration(velocityValue: number, radius: number): number {
  const v = requireFinite(velocityValue, 'velocity')
  const r = nonzero(radius, 'radius')
  return (v ** 2) / r
}

export function angularVelocity(linearVelocity: number, radius: number): number {
  return requireFinite(linearVelocity, 'linear velocity') / nonzero(radius, 'radius')
}

export function circumference(radius: number): number {
  return 2 * Math.PI * requireFinite(radius, 'radius')
}

export function orbitalPeriod(radius: number, speedValue: number): number {
  return circumference(radius) / nonzero(speedValue, 'speed')
}

export function orbitalSpeed(radius: number, period: number): number {
  return circumference(radius) / nonzero(period, 'period')
}
