import { requireFinite, requireNonNegative } from './validation'
import { CalculationError } from './errors'

export interface SalaryBreakdownResult {
  grossSalary: number
  basicPay: number
  hra: number
  otherAllowances: number
  pfEmployee: number
  professionalTax: number
  otherDeductions: number
  netSalary: number
}

export function salaryBreakdown(
  grossSalary: number,
  basicPercent = 40,
  hraPercentOfBasic = 40,
  pfPercent = 12,
  professionalTax = 0,
  otherDeductions = 0,
): SalaryBreakdownResult {
  const gross = requireFinite(grossSalary, 'gross salary')
  const bp = requireFinite(basicPercent, 'basic percent')
  const hp = requireFinite(hraPercentOfBasic, 'HRA percent')
  const pp = requireFinite(pfPercent, 'PF percent')
  const pt = requireNonNegative(professionalTax, 'professional tax')
  const od = requireNonNegative(otherDeductions, 'other deductions')
  if (gross < 0) throw new CalculationError('INVALID_INPUT', 'Gross salary must be non-negative')
  const basicPay = (gross * bp) / 100
  const hra = (basicPay * hp) / 100
  const otherAllowances = gross - basicPay - hra
  const pfEmployee = (basicPay * pp) / 100
  const netSalary = gross - pfEmployee - pt - od
  return {
    grossSalary: gross,
    basicPay,
    hra,
    otherAllowances,
    pfEmployee,
    professionalTax: pt,
    otherDeductions: od,
    netSalary,
  }
}
