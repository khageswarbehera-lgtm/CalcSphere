import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import { calculateIncomeTax, gstExclusive, gstInclusive, incomeTaxSlabs, salaryBreakdown } from './financialUtilities'

describe('income tax', () => {
  it('new regime zero tax at 12 lakh taxable', () => {
    const r = calculateIncomeTax({ financialYear: '2025-26', regime: 'new', grossIncome: 1275000 })
    expect(r.taxableIncome).toBe(1200000)
    expect(r.totalTax).toBe(0)
  })

  it('new regime marginal relief just above threshold', () => {
    const r = calculateIncomeTax({ financialYear: '2025-26', regime: 'new', grossIncome: 1275001 })
    expect(r.totalTax).toBeCloseTo(1.04, 2)
  })

  it('old regime rebate boundary', () => {
    const r = calculateIncomeTax({ financialYear: '2024-25', regime: 'old', grossIncome: 550000 })
    expect(r.taxableIncome).toBe(500000)
    expect(r.totalTax).toBe(0)
  })

  it('applies surcharge and cess', () => {
    const r = calculateIncomeTax({ financialYear: '2024-25', regime: 'old', grossIncome: 6000000 })
    expect(r.surcharge).toBeGreaterThan(0)
    expect(r.cess).toBeGreaterThan(0)
    expect(r.totalTax).toBeGreaterThan(r.slabTax)
  })

  it('deductions reduce taxable income', () => {
    const r = calculateIncomeTax({ financialYear: '2025-26', regime: 'old', grossIncome: 1000000, deductions: 150000 })
    expect(r.taxableIncome).toBe(800000)
  })

  it('slabs available', () => {
    expect(incomeTaxSlabs('2025-26', 'new').length).toBeGreaterThan(0)
  })

  it('validation', () => {
    expect(() => calculateIncomeTax({ financialYear: '2025-26', regime: 'new', grossIncome: -1 })).toThrow(CalculationError)
  })
})

describe('salary', () => {
  it('salary breakdown', () => {
    const s = salaryBreakdown(100000, 40, 40, 12, 200, 0)
    expect(s.basicPay).toBe(40000)
    expect(s.hra).toBe(16000)
    expect(s.netSalary).toBeLessThan(s.grossSalary)
  })
})

describe('gst', () => {
  it('exclusive', () => {
    const b = gstExclusive(1000, 18)
    expect(b.taxable).toBe(1000)
    expect(b.tax).toBe(180)
    expect(b.total).toBe(1180)
  })

  it('inclusive', () => {
    const b = gstInclusive(1180, 18)
    expect(b.taxable).toBeCloseTo(1000, 6)
    expect(b.tax).toBeCloseTo(180, 6)
  })

  it('zero rate', () => {
    expect(gstInclusive(100, 0).tax).toBe(0)
    expect(gstExclusive(100, 0).total).toBe(100)
  })
})
