import { describe, expect, it } from 'vitest'

import {
  acceleration,
  centripetalAcceleration,
  centripetalForce,
  density,
  displacement,
  distanceFromAcceleration,
  force,
  gravitationalPotentialEnergy,
  impulse,
  kineticEnergy,
  momentum,
  power,
  pressure,
  speed,
  velocity,
  work,
} from './physics'
import { CalculationError } from './errors'

describe('physics', () => {
  it('force', () => expect(force(10, 9.8)).toBe(98))
  it('kineticEnergy', () => expect(kineticEnergy(10, 20)).toBe(2000))
  it('displacement', () => expect(displacement(20, 5)).toBe(100))

  it('speed', () => expect(speed(100, 5)).toBe(20))
  it('velocity', () => expect(velocity(100, 5)).toBe(20))
  it('acceleration', () => expect(acceleration(30, 10, 5)).toBe(4))
  it('distance from acceleration', () => expect(distanceFromAcceleration(0, 2, 3)).toBe(6))

  it('momentum', () => expect(momentum(2, 3)).toBe(6))
  it('impulse', () => expect(impulse(10, 2)).toBe(20))
  it('work', () => expect(work(10, 5)).toBe(50))
  it('work with angle', () => expect(work(10, 5, 60)).toBeCloseTo(25, 6))

  it('potential energy', () => expect(gravitationalPotentialEnergy(2, 5)).toBe(98))
  it('power', () => expect(power(100, 5)).toBe(20))
  it('density', () => expect(density(10, 2)).toBe(5))
  it('pressure', () => expect(pressure(100, 2)).toBe(50))

  it('centripetal force', () => expect(centripetalForce(2, 4, 2)).toBe(16))
  it('centripetal acceleration', () => expect(centripetalAcceleration(4, 2)).toBe(8))

  it('division by zero', () => {
    expect(() => speed(10, 0)).toThrow(CalculationError)
    expect(() => density(10, 0)).toThrow(CalculationError)
    expect(() => pressure(10, 0)).toThrow(CalculationError)
    expect(() => centripetalForce(2, 4, 0)).toThrow(CalculationError)
  })

  it('edge cases zero', () => {
    expect(force(0, 9.8)).toBe(0)
    expect(kineticEnergy(0, 20)).toBe(0)
    expect(work(10, 0)).toBe(0)
  })
})
