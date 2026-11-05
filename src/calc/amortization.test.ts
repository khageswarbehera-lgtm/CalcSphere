import { describe, expect, it } from 'vitest'
import { CalculationError } from './errors'
import { amortizationSchedule, compareAmortizationScenarios } from './amortization'

describe('amortization', () => {
  it('balance reaches zero', () => {
    const s = amortizationSchedule(100000, 10, 5)
    const last = s.installments[s.installments.length - 1]
    expect(last.closingBalance).toBeCloseTo(0, 6)
    expect(s.payoffMonth).toBe(60)
  })

  it('totals reconcile', () => {
    const s = amortizationSchedule(100000, 10, 5)
    const principalTotal = s.installments.reduce((sum, row) => sum + row.principal, 0)
    const interestTotal = s.installments.reduce((sum, row) => sum + row.interest, 0)
    const paymentTotal = s.installments.reduce((sum, row) => sum + row.payment, 0)
    expect(principalTotal).toBeCloseTo(s.principal, 6)
    expect(interestTotal).toBeCloseTo(s.totalInterest, 6)
    expect(paymentTotal).toBeCloseTo(s.totalPayments, 6)
    expect(s.totalPayments).toBeCloseTo(s.totalPrincipal + s.totalInterest, 6)
  })

  it('handles zero interest', () => {
    const s = amortizationSchedule(12000, 0, 1)
    expect(s.scheduledEmi).toBe(1000)
    expect(s.installments.length).toBe(12)
    expect(s.installments[11].closingBalance).toBeCloseTo(0, 6)
  })

  it('prepayment reduces tenure', () => {
    const comparison = compareAmortizationScenarios(100000, 10, 5, 500)
    expect(comparison.prepayment.payoffMonth).toBeLessThan(comparison.baseline.payoffMonth)
    expect(comparison.interestSaved).toBeGreaterThan(0)
    expect(comparison.monthsSaved).toBeGreaterThan(0)
  })

  it('final installment handles rounding', () => {
    const s = amortizationSchedule(1000, 7.5, 1)
    const last = s.installments[s.installments.length - 1]
    expect(last.closingBalance).toBeCloseTo(0, 6)
  })

  it('early payoff with large extra payment', () => {
    const s = amortizationSchedule(1000, 10, 5, 10000)
    expect(s.payoffMonth).toBe(1)
    expect(s.installments[0].closingBalance).toBeCloseTo(0, 6)
  })

  it('invalid schedules', () => {
    expect(() => amortizationSchedule(0, 10, 5)).toThrow(CalculationError)
    expect(() => amortizationSchedule(1000, -1, 5)).toThrow(CalculationError)
    expect(() => amortizationSchedule(1000, 10, 0)).toThrow(CalculationError)
    expect(() => amortizationSchedule(1000, 10, 5, -1)).toThrow(CalculationError)
  })
})
