import { useState } from 'react'
import { Card, NumberInput } from './UI'
import { calculateIncomeTax, gstExclusive, gstInclusive, salaryBreakdown } from '../calc'

export function FinancialUtilitiesSection() {
  const [gstAmount, setGstAmount] = useState(1000)
  const [gstRate, setGstRate] = useState(18)
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive')
  const [gstResult, setGstResult] = useState('')

  const [grossSalary, setGrossSalary] = useState(100000)
  const [basicPercent, setBasicPercent] = useState(40)
  const [pfPercent, setPfPercent] = useState(12)
  const [professionalTax, setProfessionalTax] = useState(200)
  const [otherDeductions, setOtherDeductions] = useState(0)

  const [fy, setFy] = useState<'2024-25' | '2025-26'>('2025-26')
  const [regime, setRegime] = useState<'new' | 'old'>('new')
  const [grossIncome, setGrossIncome] = useState(1200000)
  const [taxDeductions, setTaxDeductions] = useState(0)
  const [ageCategory, setAgeCategory] = useState<'below60' | '60-80' | '80plus'>('below60')

  const salary = salaryBreakdown(grossSalary, basicPercent, 40, pfPercent, professionalTax, otherDeductions)
  let taxResult: any = null
  try {
    taxResult = calculateIncomeTax({ financialYear: fy, regime, grossIncome, deductions: taxDeductions, ageCategory })
  } catch (e) {
    taxResult = null
  }

  return (
    <div className="grid math-grid">
      <Card title="GST calculator">
        <NumberInput label="Amount" value={gstAmount} onChange={setGstAmount} suffix="₹" />
        <NumberInput label="GST rate" value={gstRate} onChange={setGstRate} suffix="%" />
        <label htmlFor="fu-gst-type">GST type</label>
        <select id="fu-gst-type" aria-label="GST type" value={gstMode} onChange={e => setGstMode(e.target.value as 'exclusive' | 'inclusive')}>
          <option value="exclusive">Exclusive (amount excludes GST)</option>
          <option value="inclusive">Inclusive (amount includes GST)</option>
        </select>
        <button onClick={() => {
          const b = gstMode === 'exclusive' ? gstExclusive(gstAmount, gstRate) : gstInclusive(gstAmount, gstRate)
          setGstResult(`Taxable: ₹${b.taxable.toFixed(2)} | Tax: ₹${b.tax.toFixed(2)} | Total: ₹${b.total.toFixed(2)}`)
        }}>Calculate</button>
        {gstResult && <p>{gstResult}</p>}
      </Card>

      <Card title="Salary breakdown">
        <NumberInput label="Gross salary" value={grossSalary} onChange={setGrossSalary} suffix="₹" />
        <NumberInput label="Basic %" value={basicPercent} onChange={setBasicPercent} suffix="%" />
        <NumberInput label="PF %" value={pfPercent} onChange={setPfPercent} suffix="%" />
        <NumberInput label="Professional tax" value={professionalTax} onChange={setProfessionalTax} suffix="₹" />
        <NumberInput label="Other deductions" value={otherDeductions} onChange={setOtherDeductions} suffix="₹" />
        <p>Gross: ₹{salary.grossSalary.toFixed(2)}</p>
        <p>Basic pay: ₹{salary.basicPay.toFixed(2)}</p>
        <p>HRA: ₹{salary.hra.toFixed(2)}</p>
        <p>Other allowances: ₹{salary.otherAllowances.toFixed(2)}</p>
        <p>PF employee: ₹{salary.pfEmployee.toFixed(2)}</p>
        <p>Net salary: ₹{salary.netSalary.toFixed(2)}</p>
        <p>Assumption: illustrative split (basic 40%, HRA 40% of basic); actual salary structures vary.</p>
      </Card>

      <Card title="Income tax estimation">
        <label htmlFor="financial-year">Financial year</label>
        <select id="financial-year" aria-label="Financial year" value={fy} onChange={e => setFy(e.target.value as '2024-25' | '2025-26')}>
          <option value="2024-25">FY 2024-25</option>
          <option value="2025-26">FY 2025-26</option>
        </select>
        <label htmlFor="tax-regime">Tax regime</label>
        <select id="tax-regime" aria-label="Tax regime" value={regime} onChange={e => setRegime(e.target.value as 'new' | 'old')}>
          <option value="new">New regime</option>
          <option value="old">Old regime</option>
        </select>
        <label htmlFor="age-category">Age category</label>
        <select id="age-category" aria-label="Age category" value={ageCategory} onChange={e => setAgeCategory(e.target.value as 'below60' | '60-80' | '80plus')}>
          <option value="below60">Below 60</option>
          <option value="60-80">60 to 80</option>
          <option value="80plus">Above 80</option>
        </select>
        <NumberInput label="Gross income" value={grossIncome} onChange={setGrossIncome} suffix="₹" />
        <NumberInput label="Deductions" value={taxDeductions} onChange={setTaxDeductions} suffix="₹" />
        {taxResult && (
          <>
            <p>Taxable income: ₹{taxResult.taxableIncome.toFixed(2)}</p>
            <p>Slab tax: ₹{taxResult.slabTax.toFixed(2)}</p>
            <p>Rebate: ₹{taxResult.rebate.toFixed(2)}</p>
            <p>Surcharge: ₹{taxResult.surcharge.toFixed(2)}</p>
            <p>Cess: ₹{taxResult.cess.toFixed(2)}</p>
            <p>Total tax: ₹{taxResult.totalTax.toFixed(2)}</p>
            <p>Effective rate: {taxResult.effectiveRate.toFixed(2)}%</p>
            <details>
              <summary>Calculation steps</summary>
              <ul>
                {taxResult.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </details>
            <details>
              <summary>Assumptions</summary>
              <ul>
                {taxResult.assumptions.map((a: string, i: number) => <li key={i}>{a}</li>)}
              </ul>
            </details>
          </>
        )}
        <p>Estimate only. Tax rules change; verify with official Income Tax Department guidance. Not tax advice.</p>
      </Card>
    </div>
  )
}
