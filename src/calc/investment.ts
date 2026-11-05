import { CalculationError } from './errors'
import { requireFinite } from './validation'

export type ContributionTiming = 'end' | 'beginning'

export interface InvestmentScenario {
  annualReturn: number
  investedAmount: number
  projectedValue: number
  estimatedGrowth: number
}

export function lumpSumFutureValue(principal: number, annualReturn: number, years: number, compoundingFrequency = 1): number {
  const p = requireFinite(principal, 'principal')
  const r = requireFinite(annualReturn, 'annual return')
  const y = requireFinite(years, 'years')
  const n = requireFinite(compoundingFrequency, 'compounding frequency')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Principal must be greater than zero')
  if (r < 0) throw new CalculationError('INVALID_INPUT', 'Annual return must be non-negative')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Duration must be greater than zero')
  if (n <= 0 || !Number.isInteger(n)) throw new CalculationError('INVALID_INPUT', 'Compounding frequency must be a positive integer')
  return p * (1 + r / (100 * n)) ** (n * y)
}

export function lumpSumGrowth(principal: number, annualReturn: number, years: number, compoundingFrequency = 1): number {
  return lumpSumFutureValue(principal, annualReturn, years, compoundingFrequency) - requireFinite(principal, 'principal')
}

export function sipFutureValue(installment: number, annualReturn: number, years: number, contributionsPerYear = 12, timing: ContributionTiming = 'end'): number {
  const p = requireFinite(installment, 'installment')
  const r = requireFinite(annualReturn, 'annual return')
  const y = requireFinite(years, 'years')
  const n = requireFinite(contributionsPerYear, 'contributions per year')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Installment must be greater than zero')
  if (r < 0) throw new CalculationError('INVALID_INPUT', 'Annual return must be non-negative')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Duration must be greater than zero')
  if (n <= 0 || !Number.isInteger(n)) throw new CalculationError('INVALID_INPUT', 'Contribution frequency must be a positive integer')

  const periods = n * y
  const periodicRate = r / (100 * n)

  let value: number
  if (periodicRate === 0) {
    value = p * periods
  } else {
    const growthFactor = (1 + periodicRate) ** periods
    value = p * ((growthFactor - 1) / periodicRate)
    if (timing === 'beginning') value *= (1 + periodicRate)
  }
  return value
}

export function sipInvestedAmount(installment: number, years: number, contributionsPerYear = 12): number {
  const p = requireFinite(installment, 'installment')
  const y = requireFinite(years, 'years')
  const n = requireFinite(contributionsPerYear, 'contributions per year')
  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Installment must be greater than zero')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Duration must be greater than zero')
  if (n <= 0 || !Number.isInteger(n)) throw new CalculationError('INVALID_INPUT', 'Contribution frequency must be a positive integer')
  return p * n * y
}

export function sipGrowth(installment: number, annualReturn: number, years: number, contributionsPerYear = 12, timing: ContributionTiming = 'end'): number {
  return sipFutureValue(installment, annualReturn, years, contributionsPerYear, timing) - sipInvestedAmount(installment, years, contributionsPerYear)
}

export function sipScenarios(installment: number, years: number, annualReturns: number[], contributionsPerYear = 12, timing: ContributionTiming = 'end'): InvestmentScenario[] {
  return annualReturns.map(rate => {
    const invested = sipInvestedAmount(installment, years, contributionsPerYear)
    const projected = sipFutureValue(installment, rate, years, contributionsPerYear, timing)
    return {
      annualReturn: rate,
      investedAmount: invested,
      projectedValue: projected,
      estimatedGrowth: projected - invested,
    }
  })
}

export function lumpSumScenarios(principal: number, years: number, annualReturns: number[], compoundingFrequency = 1): InvestmentScenario[] {
  return annualReturns.map(rate => {
    const projected = lumpSumFutureValue(principal, rate, years, compoundingFrequency)
    return {
      annualReturn: rate,
      investedAmount: principal,
      projectedValue: projected,
      estimatedGrowth: projected - principal,
    }
  })
}
