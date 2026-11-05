import { useState } from 'react'
import { Card, NumberInput } from './UI'
import {
  averageOf,
  decimalToFraction,
  fractionOperation,
  isPrime,
  percentageChange,
  percentageDecreaseAmount,
  percentageIncreaseAmount,
  percentageOf,
  primeFactors,
  reversePercentageDecrease,
  reversePercentageIncrease,
  simplifyRatio,
  solveProportion,
} from '../calc'
import { gcd, lcm } from '../calc'

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(6).replace(/\.?0+$/, '')
}

export function EverydayMathSection() {
  const [pValue, setPValue] = useState(200)
  const [pPercent, setPPercent] = useState(15)
  const [pResult, setPResult] = useState('')

  const [cOriginal, setCOriginal] = useState(100)
  const [cPercent, setCPercent] = useState(20)
  const [cResult, setCResult] = useState('')

  const [chOld, setChOld] = useState(80)
  const [chNew, setChNew] = useState(100)
  const [chResult, setChResult] = useState('')

  const [rFinal, setRFinal] = useState(120)
  const [rPercent, setRPercent] = useState(20)
  const [rMode, setRMode] = useState<'increase' | 'decrease'>('increase')
  const [rResult, setRResult] = useState('')

  const [ra, setRa] = useState(8)
  const [rb, setRb] = useState(12)
  const [raResult, setRaResult] = useState('')

  const [pa, setPa] = useState(2)
  const [pb, setPb] = useState(3)
  const [pc, setPc] = useState(4)
  const [ppResult, setPpResult] = useState('')

  const [fa, setFa] = useState(1)
  const [fb, setFb] = useState(2)
  const [fc, setFc] = useState(1)
  const [fd, setFd] = useState(3)
  const [fOp, setFOp] = useState<'+' | '-' | '*' | '/'>('+')
  const [fResult, setFResult] = useState('')

  const [dValue, setDValue] = useState(0.75)
  const [dResult, setDResult] = useState('')

  const [avgInput, setAvgInput] = useState('10, 20, 30')
  const [avgResult, setAvgResult] = useState('')

  const [hA, setHA] = useState(12)
  const [hB, setHB] = useState(18)
  const [hResult, setHResult] = useState('')

  const [primeN, setPrimeN] = useState(17)
  const [primeResult, setPrimeResult] = useState('')

  const [pfN, setPfN] = useState(60)
  const [pfResult, setPfResult] = useState('')

  return (
    <div className="grid">
      <Card title="Percentage of a number">
        <NumberInput label="Value" value={pValue} onChange={setPValue} />
        <NumberInput label="Percent" value={pPercent} onChange={setPPercent} suffix="%" />
        <p>Formula: value × percent ÷ 100</p>
        <button onClick={() => setPResult(fmt(percentageOf(pValue, pPercent)))}>Calculate</button>
        {pResult && <p>Result: {pResult}</p>}
      </Card>

      <Card title="Percentage increase / decrease">
        <NumberInput label="Original" value={cOriginal} onChange={setCOriginal} />
        <NumberInput label="Percent" value={cPercent} onChange={setCPercent} suffix="%" />
        <p>Formula: original × (1 ± percent/100)</p>
        <button onClick={() => setCResult(`Increase: ${fmt(percentageIncreaseAmount(cOriginal, cPercent))} | Decrease: ${fmt(percentageDecreaseAmount(cOriginal, cPercent))}`)}>Calculate</button>
        {cResult && <p>{cResult}</p>}
      </Card>

      <Card title="Percentage change">
        <NumberInput label="Original" value={chOld} onChange={setChOld} />
        <NumberInput label="New" value={chNew} onChange={setChNew} />
        <p>Formula: (new − original) ÷ original × 100</p>
        <button onClick={() => {
          try { setChResult(`${fmt(percentageChange(chOld, chNew))}%`) } catch (e: any) { setChResult(e?.message ?? 'Invalid input') }
        }}>Calculate</button>
        {chResult && <p>Result: {chResult}</p>}
      </Card>
      <Card title="Reverse percentage">
        <NumberInput label="Final value" value={rFinal} onChange={setRFinal} />
        <NumberInput label="Percent" value={rPercent} onChange={setRPercent} suffix="%" />
        <label htmlFor="reverse-mode">Mode</label>
        <select id="reverse-mode" aria-label="Reverse percentage mode" value={rMode} onChange={e => setRMode(e.target.value as 'increase' | 'decrease')}>
          <option value="increase">After increase</option>
          <option value="decrease">After decrease</option>
        </select>
        <p>Formula: final ÷ (1 ± percent/100)</p>
        <button onClick={() => {
          try {
            const v = rMode === 'increase' ? reversePercentageIncrease(rFinal, rPercent) : reversePercentageDecrease(rFinal, rPercent)
            setRResult(fmt(v))
          } catch (e: any) { setRResult(e?.message ?? 'Invalid input') }
        }}>Calculate</button>
        {rResult && <p>Original: {rResult}</p>}
      </Card>

      <Card title="Simplify ratio">
        <NumberInput label="A" value={ra} onChange={setRa} />
        <NumberInput label="B" value={rb} onChange={setRb} />
        <p>Formula: divide both terms by their HCF</p>
        <button onClick={() => {
          try {
            const [a, b] = simplifyRatio(ra, rb)
            setRaResult(`${fmt(a)} : ${fmt(b)}`)
          } catch (e: any) { setRaResult(e?.message ?? 'Invalid input') }
        }}>Calculate</button>
        {raResult && <p>Result: {raResult}</p>}
      </Card>

      <Card title="Proportion (a : b = c : x)">
        <NumberInput label="a" value={pa} onChange={setPa} />
        <NumberInput label="b" value={pb} onChange={setPb} />
        <NumberInput label="c" value={pc} onChange={setPc} />
        <p>Formula: x = b × c ÷ a</p>
        <button onClick={() => {
          try { setPpResult(fmt(solveProportion(pa, pb, pc))) } catch (e: any) { setPpResult(e?.message ?? 'Invalid input') }
        }}>Calculate</button>
        {ppResult && <p>x = {ppResult}</p>}
      </Card>
      <Card title="Fraction arithmetic">
        <NumberInput label="Numerator 1" value={fa} onChange={setFa} />
        <NumberInput label="Denominator 1" value={fb} onChange={setFb} />
        <NumberInput label="Numerator 2" value={fc} onChange={setFc} />
        <NumberInput label="Denominator 2" value={fd} onChange={setFd} />
        <select id="fraction-operation" aria-label="Fraction operation" value={fOp} onChange={e => setFOp(e.target.value as any)}>
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        <p>Formula: standard fraction arithmetic, result simplified</p>
        <button onClick={() => {
          try {
            const r = fractionOperation(fa, fb, fc, fd, fOp)
            setFResult(`${fmt(r.numerator)} / ${fmt(r.denominator)}`)
          } catch (e: any) { setFResult(e?.message ?? 'Invalid input') }
        }}>Calculate</button>
        {fResult && <p>Result: {fResult}</p>}
      </Card>

      <Card title="Decimal to fraction">
        <NumberInput label="Decimal" value={dValue} onChange={setDValue} />
        <p>Formula: scale by powers of 10, then simplify by HCF</p>
        <button onClick={() => {
          try {
            const r = decimalToFraction(dValue)
            setDResult(`${r.numerator} / ${r.denominator}`)
          } catch (e: any) { setDResult(e?.message ?? 'Invalid input') }
        }}>Convert</button>
        {dResult && <p>Fraction: {dResult}</p>}
      </Card>

      <Card title="Average">
        <label htmlFor="average-numbers">Numbers (comma separated)</label>
        <input id="average-numbers" aria-label="Numbers (comma separated)" value={avgInput} onChange={e => setAvgInput(e.target.value)} />
        <p>Formula: sum ÷ count</p>
        <button onClick={() => {
          try {
            const nums = avgInput.split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n))
            setAvgResult(fmt(averageOf(nums)))
          } catch (e: any) { setAvgResult(e?.message ?? 'Invalid input') }
        }}>Calculate</button>
        {avgResult && <p>Average: {avgResult}</p>}
      </Card>

      <Card title="HCF and LCM">
        <NumberInput label="A" value={hA} onChange={setHA} />
        <NumberInput label="B" value={hB} onChange={setHB} />
        <p>Formula: HCF via Euclidean algorithm; LCM = |a×b| ÷ HCF</p>
        <button onClick={() => {
          try { setHResult(`HCF: ${fmt(gcd(hA, hB))} | LCM: ${fmt(lcm(hA, hB))}`) } catch (e: any) { setHResult(e?.message ?? 'Invalid input') }
        }}>Calculate</button>
        {hResult && <p>{hResult}</p>}
      </Card>

      <Card title="Prime check">
        <NumberInput label="Number" value={primeN} onChange={setPrimeN} />
        <p>Formula: trial division up to √n</p>
        <button onClick={() => {
          try { setPrimeResult(isPrime(primeN) ? 'Prime' : 'Not prime') } catch (e: any) { setPrimeResult(e?.message ?? 'Invalid input') }
        }}>Check</button>
        {primeResult && <p>Result: {primeResult}</p>}
      </Card>

      <Card title="Prime factorization">
        <NumberInput label="Number" value={pfN} onChange={setPfN} />
        <p>Formula: divide out primes from 2 upward</p>
        <button onClick={() => {
          try { setPfResult(primeFactors(pfN).join(' × ')) } catch (e: any) { setPfResult(e?.message ?? 'Invalid input') }
        }}>Factorize</button>
        {pfResult && <p>Factors: {pfResult}</p>}
      </Card>
    </div>
  )
}