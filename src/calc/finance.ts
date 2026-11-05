export * from './investment'

import { CalculationError } from './errors'
import { requireFinite } from './validation'

export function monthlyRate(annualPercent: number): number {
  return requireFinite(annualPercent, 'annualPercent') / 1200
}

export function emi(principal: number, annualPercent: number, years: number): number {
  const p = requireFinite(principal, 'principal')
  const r = requireFinite(annualPercent, 'annualPercent')
  const y = requireFinite(years, 'years')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Principal must be greater than zero')
  if (r < 0) throw new CalculationError('INVALID_INPUT', 'Interest rate must be non-negative')
  const months = y * 12
  if (months <= 0) {
    throw new CalculationError('INVALID_INPUT', 'Loan tenure must be greater than zero')
  }
  const monthlyRateValue = r / 1200
  if (monthlyRateValue === 0) return p / months
  const factor = (1 + monthlyRateValue) ** months
  return (p * monthlyRateValue * factor) / (factor - 1)
}

export function totalPayment(emiValue: number, months: number): number {
  return requireFinite(emiValue, 'emi') * requireFinite(months, 'months')
}

export function interestPaid(total: number, principal: number): number {
  return requireFinite(total, 'total') - requireFinite(principal, 'principal')
}

export function monthsFromYears(years: number): number {
  return requireFinite(years, 'years') * 12
}

export function fdMaturity(principal: number, annualPercent: number, years: number): number {
  const p = requireFinite(principal, 'principal')
  const r = requireFinite(annualPercent, 'annualPercent')
  const y = requireFinite(years, 'years')
  return p * (1 + r / 100) ** y
}
export function simpleInterest(principal: number, annualPercent: number, years: number): number {
  const p = requireFinite(principal, 'principal')
  const r = requireFinite(annualPercent, 'annualPercent')
  const y = requireFinite(years, 'years')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Principal must be greater than zero')
  if (r < 0) throw new CalculationError('INVALID_INPUT', 'Interest rate must be non-negative')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Time must be greater than zero')
  return (p * r * y) / 100
}

export function simpleInterestAmount(principal: number, annualPercent: number, years: number): number {
  return requireFinite(principal, 'principal') + simpleInterest(principal, annualPercent, years)
}

export function compoundInterest(principal: number, annualPercent: number, years: number, compoundingFrequency = 1): number {
  const p = requireFinite(principal, 'principal')
  const r = requireFinite(annualPercent, 'annualPercent')
  const y = requireFinite(years, 'years')
  const n = requireFinite(compoundingFrequency, 'compounding frequency')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Principal must be greater than zero')
  if (r < 0) throw new CalculationError('INVALID_INPUT', 'Interest rate must be non-negative')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Time must be greater than zero')
  if (n <= 0) throw new CalculationError('INVALID_INPUT', 'Compounding frequency must be greater than zero')
  const amount = p * (1 + r / (100 * n)) ** (n * y)
  return amount - p
}

export function compoundAmount(principal: number, annualPercent: number, years: number, compoundingFrequency = 1): number {
  const p = requireFinite(principal, 'principal')
  const ci = compoundInterest(principal, annualPercent, years, compoundingFrequency)
  return p + ci
}

export interface LoanSummary {
  principal: number
  annualPercent: number
  years: number
  months: number
  monthlyRate: number
  monthlyEmi: number
  totalPayment: number
  totalInterest: number
}

export function loanSummary(principal: number, annualPercent: number, years: number): LoanSummary {
  const p = requireFinite(principal, 'principal')
  const r = requireFinite(annualPercent, 'annualPercent')
  const y = requireFinite(years, 'years')
  const months = y * 12
  const monthlyRateValue = r / 1200
  const monthlyEmi = emi(p, r, y)
  const total = totalPayment(monthlyEmi, months)
  return {
    principal: p,
    annualPercent: r,
    years: y,
    months,
    monthlyRate: monthlyRateValue,
    monthlyEmi,
    totalPayment: total,
    totalInterest: interestPaid(total, p),
  }
}
export function fdMaturityCompounding(principal: number, annualPercent: number, years: number, compoundingFrequency = 1): number {
  const p = requireFinite(principal, 'principal')
  const r = requireFinite(annualPercent, 'annualPercent')
  const y = requireFinite(years, 'years')
  const n = requireFinite(compoundingFrequency, 'compounding frequency')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Principal must be greater than zero')
  if (r < 0) throw new CalculationError('INVALID_INPUT', 'Interest rate must be non-negative')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Tenure must be greater than zero')
  if (n <= 0 || !Number.isInteger(n)) throw new CalculationError('INVALID_INPUT', 'Compounding frequency must be a positive integer')
  return p * (1 + r / (100 * n)) ** (n * y)
}

export function fdPayoutInterest(principal: number, annualPercent: number, years: number): number {
  return simpleInterest(principal, annualPercent, years)
}

export function fdPayoutMaturity(principal: number): number {
  return requireFinite(principal, 'principal')
}

export function rdTotalDeposits(monthlyInstallment: number, years: number): number {
  const p = requireFinite(monthlyInstallment, 'monthly installment')
  const y = requireFinite(years, 'years')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Installment must be greater than zero')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Tenure must be greater than zero')
  return p * y * 12
}

export function rdMaturity(monthlyInstallment: number, annualPercent: number, years: number, compoundingFrequency = 4): number {
  const p = requireFinite(monthlyInstallment, 'monthly installment')
  const r = requireFinite(annualPercent, 'annualPercent')
  const y = requireFinite(years, 'years')
  const n = requireFinite(compoundingFrequency, 'compounding frequency')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Installment must be greater than zero')
  if (r < 0) throw new CalculationError('INVALID_INPUT', 'Interest rate must be non-negative')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Tenure must be greater than zero')
  if (![1, 2, 3, 4, 6, 12].includes(n)) throw new CalculationError('INVALID_INPUT', 'Compounding frequency must divide 12')
  const quartersOrPeriods = n * y
  const depositsPerPeriod = 12 / n
  const i = r / (100 * n)
  if (i === 0) return p * y * 12
  const numerator = (1 + i) ** quartersOrPeriods - 1
  const denominator = 1 - (1 + i) ** (-1 / depositsPerPeriod)
  if (denominator === 0) throw new CalculationError('DIVISION_BY_ZERO', 'Invalid compounding parameters')
  return p * numerator / denominator
}

export function rdInterest(monthlyInstallment: number, annualPercent: number, years: number, compoundingFrequency = 4): number {
  return rdMaturity(monthlyInstallment, annualPercent, years, compoundingFrequency) - rdTotalDeposits(monthlyInstallment, years)
}
