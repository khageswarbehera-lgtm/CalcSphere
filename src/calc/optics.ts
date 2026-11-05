import { requireFinite, requirePositive } from './validation'
import { CalculationError } from './errors'

const SPEED_OF_LIGHT = 299792458

export function lensImageDistance(focalLength: unknown, objectDistance: unknown): number {
  const f = requireFinite(focalLength, 'focal length')
  const dobj = requireFinite(objectDistance, 'object distance')
  if (dobj === 0) throw new CalculationError('DIVISION_BY_ZERO', 'object distance must not be zero')
  const denom = (1 / f) - (1 / dobj)
  if (denom === 0) throw new CalculationError('DIVISION_BY_ZERO', 'image distance is undefined')
  return 1 / denom
}

export function mirrorImageDistance(focalLength: unknown, objectDistance: unknown): number {
  return lensImageDistance(focalLength, objectDistance)
}

export function magnification(imageDistance: unknown, objectDistance: unknown): number {
  const di = requireFinite(imageDistance, 'image distance')
  const dobj = requireFinite(objectDistance, 'object distance')
  if (dobj === 0) throw new CalculationError('DIVISION_BY_ZERO', 'object distance must not be zero')
  return -di / dobj
}

export function refractiveIndex(speedInMedium: unknown): number {
  const v = requireFinite(speedInMedium, 'speed in medium')
  if (v === 0) throw new CalculationError('DIVISION_BY_ZERO', 'speed must not be zero')
  return SPEED_OF_LIGHT / v
}

export function snellAngle(theta1Degrees: unknown, n1: unknown, n2: unknown): number {
  const theta = requireFinite(theta1Degrees, 'theta1')
  const a = requireFinite(n1, 'n1')
  const b = requireFinite(n2, 'n2')
  if (b === 0) throw new CalculationError('DIVISION_BY_ZERO', 'n2 must not be zero')
  const sinTheta2 = (a * Math.sin((theta * Math.PI) / 180)) / b
  if (Math.abs(sinTheta2) > 1) throw new CalculationError('DOMAIN_ERROR', 'total internal reflection; no transmitted angle')
  return (Math.asin(sinTheta2) * 180) / Math.PI
}

export function criticalAngle(n1: unknown, n2: unknown): number {
  const a = requireFinite(n1, 'n1')
  const b = requireFinite(n2, 'n2')
  if (a <= b) throw new CalculationError('DOMAIN_ERROR', 'critical angle requires n1 > n2')
  return (Math.asin(b / a) * 180) / Math.PI
}

export function lensPower(focalLengthMeters: unknown): number {
  const f = requireFinite(focalLengthMeters, 'focal length')
  if (f === 0) throw new CalculationError('DIVISION_BY_ZERO', 'focal length must not be zero')
  return 1 / f
}

export function thinLensMagnification(focalLength: unknown, objectDistance: unknown): number {
  const di = lensImageDistance(focalLength, objectDistance)
  return magnification(di, objectDistance as number)
}
