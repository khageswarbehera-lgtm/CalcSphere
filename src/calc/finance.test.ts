import { describe, expect, it } from 'vitest'

import { emi, fdMaturity, fdMaturityCompounding, fdPayoutInterest, fdPayoutMaturity, interestPaid, monthsFromYears, monthlyRate, rdInterest, rdMaturity, rdTotalDeposits, simpleInterest, simpleInterestAmount, compoundInterest, compoundAmount, loanSummary, totalPayment } from './finance'
import { CalculationError } from './errors'

describe('finance', () => {
  it('monthlyRate', () => expect(monthlyRate(12)).toBe(0.01))
  it('emi default', () => expect(emi(500000, 8.5, 5)).toBeCloseTo(10258.265, 2))
  it('totalPayment', () => expect(totalPayment(100, 5)).toBe(500))
  it('interestPaid', () => expect(interestPaid(600, 500)).toBe(100))
  it('monthsFromYears', () => expect(monthsFromYears(2)).toBe(24))
  it('fdMaturity', () => expect(fdMaturity(1000, 10, 2)).toBeCloseTo(1210, 5))
  it('emi throws for zero years', () => {
    expect(() => emi(1000, 5, 0)).toThrow(CalculationError)
  })

  it('simple interest', () => {
    expect(simpleInterest(1000, 10, 2)).toBe(200)
    expect(simpleInterestAmount(1000, 10, 2)).toBe(1200)
  })

  it('compound interest', () => {
    expect(compoundInterest(1000, 10, 2, 1)).toBeCloseTo(210, 5)
    expect(compoundAmount(1000, 10, 2, 1)).toBeCloseTo(1210, 5)
  })

  it('loan summary', () => {
    const s = loanSummary(500000, 8.5, 5)
    expect(s.monthlyEmi).toBeCloseTo(10258.265, 2)
    expect(s.totalInterest).toBeCloseTo(115495.9, 1)
  })

  it('fd and rd', () => {
    expect(fdMaturityCompounding(10000, 7, 1, 4)).toBeCloseTo(10718.59, 1)
    expect(fdMaturity(10000, 7, 1)).toBeCloseTo(10700, 5)
    expect(fdPayoutInterest(10000, 7, 1)).toBe(700)
    expect(fdPayoutMaturity(10000)).toBe(10000)
    expect(rdTotalDeposits(1000, 1)).toBe(12000)
    expect(rdMaturity(1000, 7, 1, 4)).toBeCloseTo(12462.13, 1)
    expect(rdInterest(1000, 7, 1, 4)).toBeCloseTo(462.13, 1)
  })

  it('finance validation', () => {
    expect(() => simpleInterest(0, 10, 2)).toThrow(CalculationError)
    expect(() => simpleInterest(1000, -1, 2)).toThrow(CalculationError)
    expect(() => compoundInterest(1000, 10, 2, 0)).toThrow(CalculationError)
    expect(() => emi(0, 5, 2)).toThrow(CalculationError)
    expect(() => emi(1000, -1, 2)).toThrow(CalculationError)
  })
  it('fd/rd validation', () => {
    expect(() => fdMaturityCompounding(0, 7, 1, 4)).toThrow(CalculationError)
    expect(() => fdMaturityCompounding(1000, -1, 1, 4)).toThrow(CalculationError)
    expect(() => fdMaturityCompounding(1000, 7, 0, 4)).toThrow(CalculationError)
    expect(() => fdMaturityCompounding(1000, 7, 1, 0)).toThrow(CalculationError)
    expect(() => rdMaturity(0, 7, 1, 4)).toThrow(CalculationError)
    expect(() => rdMaturity(1000, -1, 1, 4)).toThrow(CalculationError)
    expect(() => rdMaturity(1000, 7, 0, 4)).toThrow(CalculationError)
    expect(() => rdMaturity(1000, 7, 1, 5)).toThrow(CalculationError)
  })

})