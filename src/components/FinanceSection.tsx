import { useMemo, useState } from 'react'
import { Card, NumberInput, moneyFormat } from './UI'

export function FinanceSection() {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(5)

  const finance = useMemo(() => {
    const months = years * 12
    const mRate = rate / 1200
    const emi = mRate === 0 ? principal / months : (principal * mRate * (1 + mRate) ** months) / ((1 + mRate) ** months - 1)
    return { emi, total: emi * months, interest: (emi * months) - principal }
  }, [principal, rate, years])

  return (
    <div className="grid">
      <Card title="Loan & EMI">
        <NumberInput label="Amount" value={principal} onChange={setPrincipal} suffix="₹" />
        <NumberInput label="Annual %" value={rate} onChange={setRate} suffix="%" />
        <NumberInput label="Years" value={years} onChange={setYears} suffix="y" />
        <p>Monthly EMI: {moneyFormat(finance.emi)}</p>
        <p>Total Payment: {moneyFormat(finance.total)}</p>
      </Card>
      <Card title="FD Calculator">
        <p>FD Maturity: {moneyFormat(principal * (1 + rate / 100) ** years)}</p>
      </Card>
    </div>
  )
}
