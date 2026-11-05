import { CalculationError } from './errors'
import { requireFinite, requireNonNegative } from './validation'

export type TaxRegime = 'new' | 'old'
export type FinancialYear = '2024-25' | '2025-26'
export type AgeCategory = 'below60' | '60-80' | '80plus'

export interface TaxSlab {
  min: number
  max: number | null
  rate: number
}

export interface IncomeTaxInput {
  financialYear: FinancialYear
  regime: TaxRegime
  grossIncome: number
  deductions?: number
  ageCategory?: AgeCategory
}

export interface IncomeTaxResult {
  financialYear: FinancialYear
  regime: TaxRegime
  grossIncome: number
  standardDeduction: number
  deductions: number
  taxableIncome: number
  slabTax: number
  rebate: number
  taxAfterRebate: number
  surcharge: number
  cess: number
  totalTax: number
  effectiveRate: number
  assumptions: string[]
  steps: string[]
  slabs: TaxSlab[]
}

const TAX_SLABS: Record<FinancialYear, Record<TaxRegime, Record<AgeCategory, TaxSlab[]>>> = {
  '2024-25': {
    new: {
      below60: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 700000, rate: 5 },
        { min: 700000, max: 1000000, rate: 10 },
        { min: 1000000, max: 1200000, rate: 15 },
        { min: 1200000, max: 1500000, rate: 20 },
        { min: 1500000, max: null, rate: 30 },
      ],
      '60-80': [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 700000, rate: 5 },
        { min: 700000, max: 1000000, rate: 10 },
        { min: 1000000, max: 1200000, rate: 15 },
        { min: 1200000, max: 1500000, rate: 20 },
        { min: 1500000, max: null, rate: 30 },
      ],
      '80plus': [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 700000, rate: 5 },
        { min: 700000, max: 1000000, rate: 10 },
        { min: 1000000, max: 1200000, rate: 15 },
        { min: 1200000, max: 1500000, rate: 20 },
        { min: 1500000, max: null, rate: 30 },
      ],
    },
    old: {
      below60: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
      '60-80': [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
      '80plus': [
        { min: 0, max: 500000, rate: 0 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
    },
  },
  '2025-26': {
    new: {
      below60: [
        { min: 0, max: 400000, rate: 0 },
        { min: 400000, max: 800000, rate: 5 },
        { min: 800000, max: 1200000, rate: 10 },
        { min: 1200000, max: 1600000, rate: 15 },
        { min: 1600000, max: 2000000, rate: 20 },
        { min: 2000000, max: 2400000, rate: 25 },
        { min: 2400000, max: null, rate: 30 },
      ],
      '60-80': [
        { min: 0, max: 400000, rate: 0 },
        { min: 400000, max: 800000, rate: 5 },
        { min: 800000, max: 1200000, rate: 10 },
        { min: 1200000, max: 1600000, rate: 15 },
        { min: 1600000, max: 2000000, rate: 20 },
        { min: 2000000, max: 2400000, rate: 25 },
        { min: 2400000, max: null, rate: 30 },
      ],
      '80plus': [
        { min: 0, max: 400000, rate: 0 },
        { min: 400000, max: 800000, rate: 5 },
        { min: 800000, max: 1200000, rate: 10 },
        { min: 1200000, max: 1600000, rate: 15 },
        { min: 1600000, max: 2000000, rate: 20 },
        { min: 2000000, max: 2400000, rate: 25 },
        { min: 2400000, max: null, rate: 30 },
      ],
    },
    old: {
      below60: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
      '60-80': [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
      '80plus': [
        { min: 0, max: 500000, rate: 0 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: null, rate: 30 },
      ],
    },
  },
}

function standardDeduction(regime: TaxRegime): number {
  return regime === 'new' ? 75000 : 50000
}

function rebateThreshold(fy: FinancialYear, regime: TaxRegime): number {
  if (regime === 'new') return fy === '2024-25' ? 700000 : 1200000
  return 500000
}

function rebateCap(fy: FinancialYear, regime: TaxRegime): number {
  if (regime === 'new') return fy === '2024-25' ? 25000 : 60000
  return 12500
}

function surchargeRate(taxableIncome: number, regime: TaxRegime): number {
  if (taxableIncome <= 5000000) return 0
  if (taxableIncome <= 10000000) return 10
  if (taxableIncome <= 20000000) return 15
  if (taxableIncome <= 50000000) return 25
  return regime === 'new' ? 25 : 37
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const fy = input.financialYear
  const regime = input.regime
  const gross = requireFinite(input.grossIncome, 'gross income')
  const deductions = requireNonNegative(input.deductions ?? 0, 'deductions')
  const age = input.ageCategory ?? 'below60'
  if (gross < 0) throw new CalculationError('INVALID_INPUT', 'Gross income must be non-negative')
  if (!TAX_SLABS[fy]) throw new CalculationError('INVALID_INPUT', 'Unsupported financial year')

  const slabs = TAX_SLABS[fy][regime][age]
  const std = standardDeduction(regime)
  const taxableIncome = Math.max(0, gross - std - deductions)

  let slabTax = 0
  const slabSteps: string[] = []
  for (const slab of slabs) {
    const upper = slab.max ?? Infinity
    const amount = Math.max(0, Math.min(taxableIncome, upper) - slab.min)
    const tax = amount * (slab.rate / 100)
    slabTax += tax
    if (amount > 0) slabSteps.push(`${slab.min}-${slab.max ?? '∞'} @ ${slab.rate}%: ${amount} × ${slab.rate}% = ${tax}`)
  }

  const threshold = rebateThreshold(fy, regime)
  const cap = rebateCap(fy, regime)
  let rebate = 0
  if (taxableIncome <= threshold) rebate = Math.min(slabTax, cap)
  if (taxableIncome > threshold) {
    const excess = taxableIncome - threshold
    if (slabTax > excess) rebate = slabTax - excess
  }
  const taxAfterRebate = Math.max(0, slabTax - rebate)

  const surchargePct = surchargeRate(taxableIncome, regime)
  const surcharge = taxAfterRebate * (surchargePct / 100)
  const cess = (taxAfterRebate + surcharge) * 0.04
  const totalTax = taxAfterRebate + surcharge + cess

  const assumptions = [
    `Financial year ${fy}, ${regime} tax regime.`,
    `Standard deduction of ₹${std} applied.`,
    `User-entered deductions of ₹${deductions} applied.`,
    'Surcharge and 4% health and education cess applied as per slab thresholds.',
    'Tax slabs are built-in presets based on Budget 2024/2025; verify against official Income Tax Department rules.',
  ]

  const steps = [
    `Gross income: ₹${gross}`,
    `Less standard deduction: ₹${std}`,
    `Less deductions: ₹${deductions}`,
    `Taxable income: ₹${taxableIncome}`,
    ...slabSteps.map(s => `Slab tax: ${s}`),
    `Slab tax total: ₹${slabTax}`,
    `Rebate: ₹${rebate}`,
    `Tax after rebate: ₹${taxAfterRebate}`,
    `Surcharge (${surchargePct}%): ₹${surcharge}`,
    `Cess (4%): ₹${cess}`,
    `Total tax: ₹${totalTax}`,
  ]

  return {
    financialYear: fy,
    regime,
    grossIncome: gross,
    standardDeduction: std,
    deductions,
    taxableIncome,
    slabTax,
    rebate,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
    assumptions,
    steps,
    slabs,
  }
}

export function incomeTaxSlabs(fy: FinancialYear, regime: TaxRegime, ageCategory: AgeCategory = 'below60'): TaxSlab[] {
  return TAX_SLABS[fy][regime][ageCategory]
}
