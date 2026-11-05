import { CalculationError } from './errors'
import { requireFinite } from './validation'
import { emi, totalPayment } from './finance'

export interface AmortizationInstallment {
  month: number
  openingBalance: number
  payment: number
  scheduledEmi: number
  interest: number
  principal: number
  extraPrincipal: number
  closingBalance: number
}

export interface AmortizationSummary {
  principal: number
  annualPercent: number
  years: number
  monthsScheduled: number
  monthlyRate: number
  scheduledEmi: number
  extraPayment: number
  totalPayments: number
  totalInterest: number
  totalPrincipal: number
  payoffMonth: number
  installments: AmortizationInstallment[]
}

export interface AmortizationComparison {
  baseline: AmortizationSummary
  prepayment: AmortizationSummary
  interestSaved: number
  monthsSaved: number
}

const BALANCE_TOLERANCE = 1e-6

export function amortizationSchedule(
  principal: number,
  annualPercent: number,
  years: number,
  extraPayment = 0,
): AmortizationSummary {
  const p = requireFinite(principal, 'principal')
  const r = requireFinite(annualPercent, 'annualPercent')
  const y = requireFinite(years, 'years')
  const extra = requireFinite(extraPayment, 'extra payment')

  if (p <= 0) throw new CalculationError('INVALID_INPUT', 'Principal must be greater than zero')
  if (r < 0) throw new CalculationError('INVALID_INPUT', 'Interest rate must be non-negative')
  if (y <= 0) throw new CalculationError('INVALID_INPUT', 'Loan tenure must be greater than zero')
  if (extra < 0) throw new CalculationError('INVALID_INPUT', 'Extra payment must be non-negative')

  const monthsScheduled = Math.round(y * 12)
  if (monthsScheduled <= 0) throw new CalculationError('INVALID_INPUT', 'Loan tenure must be greater than zero')

  const monthlyRate = r / 1200
  const scheduledEmi = emi(p, r, y)

  const installments: AmortizationInstallment[] = []
  let balance = p
  let totalPayments = 0
  let totalInterest = 0
  let totalPrincipal = 0
  let payoffMonth = monthsScheduled

  for (let month = 1; month <= monthsScheduled && balance > BALANCE_TOLERANCE; month += 1) {
    const openingBalance = balance
    const interest = openingBalance * monthlyRate
    let scheduledPrincipal = scheduledEmi - interest

    if (scheduledPrincipal <= BALANCE_TOLERANCE && monthlyRate > 0) {
      throw new CalculationError('INVALID_INPUT', 'Scheduled payment does not cover interest; schedule cannot amortize')
    }
    if (scheduledPrincipal > openingBalance) scheduledPrincipal = openingBalance

    let extraPrincipal = extra
    if (extraPrincipal > openingBalance - scheduledPrincipal) {
      extraPrincipal = Math.max(0, openingBalance - scheduledPrincipal)
    }

    let principalRepaid = scheduledPrincipal + extraPrincipal
    if (principalRepaid > openingBalance) {
      principalRepaid = openingBalance
      extraPrincipal = Math.max(0, principalRepaid - scheduledPrincipal)
    }

    const payment = interest + principalRepaid
    const closingBalance = Math.max(0, openingBalance - principalRepaid)

    installments.push({
      month,
      openingBalance,
      payment,
      scheduledEmi,
      interest,
      principal: principalRepaid,
      extraPrincipal,
      closingBalance,
    })

    balance = closingBalance
    totalPayments += payment
    totalInterest += interest
    totalPrincipal += principalRepaid
    payoffMonth = month

    if (balance <= BALANCE_TOLERANCE) {
      balance = 0
      break
    }
  }

  if (balance > BALANCE_TOLERANCE) {
    throw new CalculationError('INVALID_INPUT', 'Loan did not fully amortize within the scheduled period')
  }

  return {
    principal: p,
    annualPercent: r,
    years: y,
    monthsScheduled,
    monthlyRate,
    scheduledEmi,
    extraPayment: extra,
    totalPayments,
    totalInterest,
    totalPrincipal,
    payoffMonth,
    installments,
  }
}

export function compareAmortizationScenarios(
  principal: number,
  annualPercent: number,
  years: number,
  extraPayment = 0,
): AmortizationComparison {
  const baseline = amortizationSchedule(principal, annualPercent, years, 0)
  const prepayment = amortizationSchedule(principal, annualPercent, years, extraPayment)
  return {
    baseline,
    prepayment,
    interestSaved: baseline.totalInterest - prepayment.totalInterest,
    monthsSaved: baseline.payoffMonth - prepayment.payoffMonth,
  }
}
