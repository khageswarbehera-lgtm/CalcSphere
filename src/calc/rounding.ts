export function round(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return value
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function roundTo(value: number, decimals = 0): number {
  return round(value, decimals)
}

export function floor(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return value
  const factor = 10 ** decimals
  return Math.floor(value * factor) / factor
}

export function ceil(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return value
  const factor = 10 ** decimals
  return Math.ceil(value * factor) / factor
}

export function truncate(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return value
  const factor = 10 ** decimals
  return Math.trunc(value * factor) / factor
}

export function toFixedNumber(value: number, decimals = 0): number {
  return Number(value.toFixed(decimals))
}