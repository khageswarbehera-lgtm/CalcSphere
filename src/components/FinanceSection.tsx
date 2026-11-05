import { useMemo, useState } from 'react'
import { Card, NumberInput, moneyFormat } from './UI'
import { emi, fdMaturity, fdMaturityCompounding, fdPayoutInterest, interestPaid, monthsFromYears, rdInterest, rdMaturity, rdTotalDeposits, totalPayment, lumpSumFutureValue, lumpSumGrowth, sipFutureValue, sipGrowth, sipInvestedAmount, sipScenarios } from '../calc'
import {
  amortizationSchedule,
  applyDiscounts,
  compareAmortizationScenarios,
  compoundAmount,
  compoundInterest,
  discountAmount,
  gstExclusive,
  gstInclusive,
  loss,
  lossPercent,
  markedPrice,
  priceAfterDiscount,
  profit,
  profitPercent,
  sellingPrice,
  simpleInterest,
  simpleInterestAmount,
} from '../calc'

export function FinanceSection() {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(5)
  const [fdPrincipal, setFdPrincipal] = useState(10000)
  const [fdRate, setFdRate] = useState(7)
  const [fdYears, setFdYears] = useState(1)
  const [fdFreq, setFdFreq] = useState(4)
  const [rdInstallment, setRdInstallment] = useState(1000)
  const [rdRate, setRdRate] = useState(7)
  const [rdYears, setRdYears] = useState(1)
  const [rdFreq, setRdFreq] = useState(4)
  const [siPrincipal, setSiPrincipal] = useState(1000)
  const [siRate, setSiRate] = useState(10)
  const [siYears, setSiYears] = useState(2)
  const [ciPrincipal, setCiPrincipal] = useState(1000)
  const [ciRate, setCiRate] = useState(10)
  const [ciYears, setCiYears] = useState(2)
  const [ciFreq, setCiFreq] = useState(1)

  const finance = useMemo(() => {
    const months = monthsFromYears(years)
    try {
      const emiValue = emi(principal, rate, years)
      const total = totalPayment(emiValue, months)
      return { emi: emiValue, total, interest: interestPaid(total, principal) }
    } catch {
      return { emi: 0, total: 0, interest: 0 }
    }
  }, [principal, rate, years])

  const [amPrincipal, setAmPrincipal] = useState(100000)
  const [amRate, setAmRate] = useState(9)
  const [amYears, setAmYears] = useState(3)
  const [amExtra, setAmExtra] = useState(1000)
  const [investPrincipal, setInvestPrincipal] = useState(100000)
  const [investReturn, setInvestReturn] = useState(8)
  const [investYears, setInvestYears] = useState(3)
  const [sipInstallment, setSipInstallment] = useState(5000)
  const [sipReturn, setSipReturn] = useState(12)
  const [sipYears, setSipYears] = useState(10)
  const [sipFreq, setSipFreq] = useState(12)
  const [cost, setCost] = useState(100)
  const [selling, setSelling] = useState(120)
  const [profitPct, setProfitPct] = useState(20)
  const [discountPrice, setDiscountPrice] = useState(500)
  const [discountPct, setDiscountPct] = useState(10)
  const [successiveInput, setSuccessiveInput] = useState('500, 10, 5')
  const [successiveResult, setSuccessiveResult] = useState('')
  const [gstAmount, setGstAmount] = useState(1000)
  const [gstRate, setGstRate] = useState(18)
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive')
  const [gstResult, setGstResult] = useState('')
  const fd = useMemo(() => fdMaturity(principal, rate, years), [principal, rate, years])
  const amortization = useMemo(() => {
    try {
      return compareAmortizationScenarios(amPrincipal, amRate, amYears, amExtra)
    } catch {
      return null
    }
  }, [amPrincipal, amRate, amYears, amExtra])

  return (
    <div className="grid">
      <Card title="Loan & EMI">
        <NumberInput label="Amount" value={principal} onChange={setPrincipal} suffix="₹" />
        <NumberInput label="Annual %" value={rate} onChange={setRate} suffix="%" />
        <NumberInput label="Years" value={years} onChange={setYears} suffix="y" />
        <p>Monthly EMI: {moneyFormat(finance.emi)}</p>
        <p>Total Payment: {moneyFormat(finance.total)}</p>
        <p>Total Interest: {moneyFormat(finance.interest)}</p>
        <p>Assumptions: monthly payments, rate converted as annual%/12, tenure in years converted to months.</p>
      </Card>
      <Card title="Simple interest">
        <NumberInput label="Principal" value={siPrincipal} onChange={setSiPrincipal} suffix="₹" />
        <NumberInput label="Annual %" value={siRate} onChange={setSiRate} suffix="%" />
        <NumberInput label="Years" value={siYears} onChange={setSiYears} suffix="y" />
        <p>Simple interest = {moneyFormat(simpleInterest(siPrincipal, siRate, siYears))}</p>
        <p>Total amount = {moneyFormat(simpleInterestAmount(siPrincipal, siRate, siYears))}</p>
        <p>Formula: P × r × t / 100</p>
      </Card>

      <Card title="Compound interest">
        <NumberInput label="Principal" value={ciPrincipal} onChange={setCiPrincipal} suffix="₹" />
        <NumberInput label="Annual %" value={ciRate} onChange={setCiRate} suffix="%" />
        <NumberInput label="Years" value={ciYears} onChange={setCiYears} suffix="y" />
        <NumberInput label="Compounding / year" value={ciFreq} onChange={setCiFreq} suffix="" />
        <p>Compound interest = {moneyFormat(compoundInterest(ciPrincipal, ciRate, ciYears, ciFreq))}</p>
        <p>Maturity amount = {moneyFormat(compoundAmount(ciPrincipal, ciRate, ciYears, ciFreq))}</p>
        <p>Formula: P(1 + r/(100n))^(nt) − P</p>
      </Card>

      <Card title="FD Calculator">
        <p>FD Maturity: {moneyFormat(fd)}</p>
      </Card>

      <Card title="Profit / Loss">
        <NumberInput label="Cost price" value={cost} onChange={setCost} suffix="₹" />
        <NumberInput label="Selling price" value={selling} onChange={setSelling} suffix="₹" />
        <p>Profit = selling − cost; Loss = cost − selling</p>
        <p>Profit: {moneyFormat(profit(cost, selling))} {cost !== 0 ? `(${profitPercent(cost, selling).toFixed(2)}%)` : ''}</p>
        <p>Loss: {moneyFormat(loss(cost, selling))} {cost !== 0 ? `(${lossPercent(cost, selling).toFixed(2)}%)` : ''}</p>
      </Card>

      <Card title="Marked price / Selling price">
        <NumberInput label="Cost price" value={cost} onChange={setCost} suffix="₹" />
        <NumberInput label="Profit %" value={profitPct} onChange={setProfitPct} suffix="%" />
        <p>Formula: cost × (1 + profit%/100)</p>
        <p>Selling price: {moneyFormat(sellingPrice(cost, profitPct))}</p>
        <p>Marked price (same basis): {moneyFormat(markedPrice(cost, profitPct))}</p>
      </Card>

      <Card title="Discount">
        <NumberInput label="Price" value={discountPrice} onChange={setDiscountPrice} suffix="₹" />
        <NumberInput label="Discount %" value={discountPct} onChange={setDiscountPct} suffix="%" />
        <p>Formula: price × (1 − discount%/100)</p>
        <p>Discount amount: {moneyFormat(discountAmount(discountPrice, discountPct))}</p>
        <p>Final price: {moneyFormat(priceAfterDiscount(discountPrice, discountPct))}</p>
      </Card>

      <Card title="Successive discounts">
        <label htmlFor="successive-discounts">Price, discount1%, discount2%, ... (comma separated)</label>
        <input id="successive-discounts" aria-label="Successive discounts input" value={successiveInput} onChange={e => setSuccessiveInput(e.target.value)} />
        <p>Formula: price × (1 − d1/100) × (1 − d2/100) × ...</p>
        <button onClick={() => {
          try {
            const parts = successiveInput.split(',').map(s => Number(s.trim()))
            const price = parts[0]
            const discounts = parts.slice(1)
            setSuccessiveResult(moneyFormat(applyDiscounts(price, discounts)))
          } catch (e: any) { setSuccessiveResult(e?.message ?? 'Invalid input') }
        }}>Calculate</button>
        {successiveResult && <p>Final price: {successiveResult}</p>}
      </Card>

      <Card title="GST">
        <NumberInput label="Amount" value={gstAmount} onChange={setGstAmount} suffix="₹" />
        <NumberInput label="GST rate" value={gstRate} onChange={setGstRate} suffix="%" />
        <label htmlFor="finance-gst-type">GST type</label>
        <select id="finance-gst-type" aria-label="GST type" value={gstMode} onChange={e => setGstMode(e.target.value as 'exclusive' | 'inclusive')}>
          <option value="exclusive">Exclusive (amount excludes GST)</option>
          <option value="inclusive">Inclusive (amount includes GST)</option>
        </select>
        <p>Exclusive: tax = amount × rate/100. Inclusive: taxable = amount ÷ (1 + rate/100).</p>
        <button onClick={() => {
          const b = gstMode === 'exclusive' ? gstExclusive(gstAmount, gstRate) : gstInclusive(gstAmount, gstRate)
          setGstResult(`Taxable: ${moneyFormat(b.taxable)} | Tax: ${moneyFormat(b.tax)} | Total: ${moneyFormat(b.total)}`)
        }}>Calculate</button>
        {gstResult && <p>{gstResult}</p>}
      </Card>

      <Card title="Loan amortization and prepayment">
        <NumberInput label="Principal" value={amPrincipal} onChange={setAmPrincipal} suffix="₹" />
        <NumberInput label="Annual %" value={amRate} onChange={setAmRate} suffix="%" />
        <NumberInput label="Years" value={amYears} onChange={setAmYears} suffix="y" />
        <NumberInput label="Extra principal / month" value={amExtra} onChange={setAmExtra} suffix="₹" />
        {amortization && (
          <>
            <p>Base EMI: {moneyFormat(amortization.baseline.scheduledEmi)}</p>
            <p>Baseline payoff month: {amortization.baseline.payoffMonth}</p>
            <p>Baseline total interest: {moneyFormat(amortization.baseline.totalInterest)}</p>
            <p>With prepayment payoff month: {amortization.prepayment.payoffMonth}</p>
            <p>With prepayment total interest: {moneyFormat(amortization.prepayment.totalInterest)}</p>
            <p>Interest saved: {moneyFormat(amortization.interestSaved)}</p>
            <p>Months saved: {amortization.monthsSaved}</p>
            <p>Assumption: prepayment is applied to principal; the EMI stays unchanged and the loan tenure reduces. Results exclude fees unless explicitly entered.</p>
            <div style={{ maxHeight: 240, overflow: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Month</th><th>Opening</th><th>Payment</th><th>Interest</th><th>Principal</th><th>Extra</th><th>Closing</th>
                  </tr>
                </thead>
                <tbody>
                  {amortization.prepayment.installments.map(row => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>{moneyFormat(row.openingBalance)}</td>
                      <td>{moneyFormat(row.payment)}</td>
                      <td>{moneyFormat(row.interest)}</td>
                      <td>{moneyFormat(row.principal - row.extraPrincipal)}</td>
                      <td>{moneyFormat(row.extraPrincipal)}</td>
                      <td>{moneyFormat(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <Card title="Fixed deposit (FD)">
        <NumberInput label="Principal" value={fdPrincipal} onChange={setFdPrincipal} suffix="₹" />
        <NumberInput label="Annual %" value={fdRate} onChange={setFdRate} suffix="%" />
        <NumberInput label="Years" value={fdYears} onChange={setFdYears} suffix="y" />
        <NumberInput label="Compounding / year" value={fdFreq} onChange={setFdFreq} suffix="" />
        <p>Maturity (compounded) = {moneyFormat(fdMaturityCompounding(fdPrincipal, fdRate, fdYears, fdFreq))}</p>
        <p>Annual compounding maturity = {moneyFormat(fdMaturity(fdPrincipal, fdRate, fdYears))}</p>
        <p>Payout interest (simple) = {moneyFormat(fdPayoutInterest(fdPrincipal, fdRate, fdYears))}</p>
        <p>Assumption: configurable compounding; actual bank terms, taxes and payout rules may differ.</p>
      </Card>

      <Card title="Recurring deposit (RD)">
        <NumberInput label="Monthly installment" value={rdInstallment} onChange={setRdInstallment} suffix="₹" />
        <NumberInput label="Annual %" value={rdRate} onChange={setRdRate} suffix="%" />
        <NumberInput label="Years" value={rdYears} onChange={setRdYears} suffix="y" />
        <NumberInput label="Compounding / year" value={rdFreq} onChange={setRdFreq} suffix="" />
        <p>Total deposits = {moneyFormat(rdTotalDeposits(rdInstallment, rdYears))}</p>
        <p>Estimated maturity = {moneyFormat(rdMaturity(rdInstallment, rdRate, rdYears, rdFreq))}</p>
        <p>Estimated interest = {moneyFormat(rdInterest(rdInstallment, rdRate, rdYears, rdFreq))}</p>
        <p>Installment timing: monthly deposits are aggregated by compounding period; actual bank rules may differ.</p>
        <p>Assumption: estimate only; not a verified bank maturity calculation.</p>
      </Card>

      <Card title="Lump-sum investment growth">
        <NumberInput label="Principal" value={investPrincipal} onChange={setInvestPrincipal} suffix="₹" />
        <NumberInput label="Assumed annual return" value={investReturn} onChange={setInvestReturn} suffix="%" />
        <NumberInput label="Years" value={investYears} onChange={setInvestYears} suffix="y" />
        <p>Invested amount: {moneyFormat(investPrincipal)}</p>
        <p>Projected value: {moneyFormat(lumpSumFutureValue(investPrincipal, investReturn, investYears))}</p>
        <p>Estimated growth: {moneyFormat(lumpSumGrowth(investPrincipal, investReturn, investYears))}</p>
        <p>Assumption: hypothetical constant annual return; not guaranteed and not financial advice.</p>
      </Card>

      <Card title="SIP investment growth">
        <NumberInput label="Installment" value={sipInstallment} onChange={setSipInstallment} suffix="₹" />
        <NumberInput label="Assumed annual return" value={sipReturn} onChange={setSipReturn} suffix="%" />
        <NumberInput label="Years" value={sipYears} onChange={setSipYears} suffix="y" />
        <NumberInput label="Contributions / year" value={sipFreq} onChange={setSipFreq} suffix="" />
        <p>Invested amount: {moneyFormat(sipInvestedAmount(sipInstallment, sipYears, sipFreq))}</p>
        <p>Projected value (end of period): {moneyFormat(sipFutureValue(sipInstallment, sipReturn, sipYears, sipFreq, 'end'))}</p>
        <p>Estimated growth: {moneyFormat(sipGrowth(sipInstallment, sipReturn, sipYears, sipFreq, 'end'))}</p>
        <p>Contributions are assumed at the end of each period; beginning-of-period timing increases the estimate.</p>
        <p>Assumption: hypothetical constant return; not guaranteed and not financial advice.</p>
      </Card>
    </div>
  )
}
