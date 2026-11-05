import { requireFinite, requireNonNegative } from './validation'
import { CalculationError } from './errors'

export interface GstBreakdown {
  taxable: number
  tax: number
  total: number
}

export function profit(cost: number, selling: number): number {
  return requireFinite(selling, 'selling') - requireFinite(cost, 'cost')
}

export function loss(cost: number, selling: number): number {
  return requireFinite(cost, 'cost') - requireFinite(selling, 'selling')
}

export function profitPercent(cost: number, selling: number): number {
  const c = requireFinite(cost, 'cost')
  if (c === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Cost cannot be zero')
  return ((requireFinite(selling, 'selling') - c) / c) * 100
}

export function lossPercent(cost: number, selling: number): number {
  const c = requireFinite(cost, 'cost')
  if (c === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Cost cannot be zero')
  return ((c - requireFinite(selling, 'selling')) / c) * 100
}

export function sellingPrice(cost: number, profitPercentValue: number): number {
  const c = requireFinite(cost, 'cost')
  const p = requireFinite(profitPercentValue, 'profitPercent')
  return c * (1 + p / 100)
}

export function markedPrice(cost: number, markupPercent: number): number {
  return sellingPrice(cost, markupPercent)
}

export function discountAmount(price: number, percent: number): number {
  const p = requireFinite(price, 'price')
  const r = requireFinite(percent, 'percent')
  return (p * r) / 100
}

export function priceAfterDiscount(price: number, percent: number): number {
  return requireFinite(price, 'price') - discountAmount(price, percent)
}

export function applyDiscounts(price: number, discounts: number[]): number {
  let current = requireFinite(price, 'price')
  for (const d of discounts) {
    const r = requireFinite(d, 'discount')
    current = current * (1 - r / 100)
  }
  return current
}

export function gstExclusive(amount: number, rate: number): GstBreakdown {
  const base = requireFinite(amount, 'amount')
  const r = requireNonNegative(rate, 'rate')
  const tax = (base * r) / 100
  return { taxable: base, tax, total: base + tax }
}

export function gstInclusive(amount: number, rate: number): GstBreakdown {
  const total = requireFinite(amount, 'amount')
  const r = requireNonNegative(rate, 'rate')
  if (r === 0) return { taxable: total, tax: 0, total }
  const taxable = total / (1 + r / 100)
  const tax = total - taxable
  return { taxable, tax, total }
}