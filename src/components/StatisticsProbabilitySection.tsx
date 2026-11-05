import { useState } from 'react'
import { Card, NumberInput } from './UI'
import {
  binomialCdf,
  binomialProbability,
  combinations,
  complementProbability,
  descriptiveStatistics,
  factorial,
  intersectionIndependent,
  mean,
  median,
  mode,
  normalCdf,
  normalPdf,
  permutations,
  poissonProbability,
  sampleStandardDeviation,
  sampleVariance,
  unionProbability,
} from '../calc'

export function StatisticsProbabilitySection() {
  const [dataText, setDataText] = useState('1, 2, 2, 3, 4')
  const [statsResult, setStatsResult] = useState('')
  const [varianceMode, setVarianceMode] = useState<'sample' | 'population'>('sample')

  const [permN, setPermN] = useState(5)
  const [permR, setPermR] = useState(3)
  const [combResult, setCombResult] = useState('')

  const [probA, setProbA] = useState(0.5)
  const [probB, setProbB] = useState(0.4)
  const [probInter, setProbInter] = useState(0.2)
  const [probResult, setProbResult] = useState('')

  const [binN, setBinN] = useState(10)
  const [binP, setBinP] = useState(0.5)
  const [binK, setBinK] = useState(5)
  const [binResult, setBinResult] = useState('')

  const [normX, setNormX] = useState(0)
  const [normMean, setNormMean] = useState(0)
  const [normSd, setNormSd] = useState(1)
  const [normResult, setNormResult] = useState('')

  const run = (fn: () => void, setter: (v: string) => void, fallback = 'Invalid input') => {
    try { fn() } catch (e: any) { setter(e?.message ?? fallback) }
  }

  return (
    <div className="grid math-grid">
      <Card title="Descriptive statistics">
        <input aria-label="Dataset" value={dataText} onChange={e => setDataText(e.target.value)} placeholder="comma-separated data" />
        <div className="angle-mode">
          <span>Variance convention: {varianceMode}</span>
          <button onClick={() => setVarianceMode(m => (m === 'sample' ? 'population' : 'sample'))}>
            Switch to {varianceMode === 'sample' ? 'population' : 'sample'}
          </button>
        </div>
        <p>Sample uses n-1 (Bessel correction); population uses n.</p>
        <button onClick={() => run(() => {
          const s = descriptiveStatistics(dataText)
          const sd = varianceMode === 'sample' ? sampleStandardDeviation(dataText) : Math.sqrt(s.populationVariance)
          const vr = varianceMode === 'sample' ? sampleVariance(dataText) : s.populationVariance
          setStatsResult(`count=${s.count}, mean=${s.mean}, median=${s.median}, mode=${JSON.stringify(s.mode)}, range=${s.range}, variance=${vr}, sd=${sd}`)
        }, setStatsResult)}>Analyze</button>
        {statsResult && <p>Result: {statsResult}</p>}
      </Card>
      <Card title="Combinatorics">
        <NumberInput label="n" value={permN} onChange={setPermN} />
        <NumberInput label="r" value={permR} onChange={setPermR} />
        <div className="action-buttons">
          <button onClick={() => setCombResult(`P(${permN},${permR}) = ${permutations(permN, permR)}`)}>Permutations</button>
          <button onClick={() => setCombResult(`C(${permN},${permR}) = ${combinations(permN, permR)}`)}>Combinations</button>
          <button onClick={() => setCombResult(`${permN}! = ${factorial(permN)}`)}>Factorial</button>
        </div>
        {combResult && <p>Result: {combResult}</p>}
      </Card>

      <Card title="Basic probability">
        <NumberInput label="P(A)" value={probA} onChange={setProbA} />
        <NumberInput label="P(B)" value={probB} onChange={setProbB} />
        <NumberInput label="P(A∩B)" value={probInter} onChange={setProbInter} />
        <div className="action-buttons">
          <button onClick={() => setProbResult(`P(A∪B) = ${unionProbability(probA, probB, probInter)}`)}>Union</button>
          <button onClick={() => setProbResult(`P(A∩B) independent = ${intersectionIndependent(probA, probB)}`)}>Independent intersection</button>
          <button onClick={() => setProbResult(`P(A^c) = ${complementProbability(probA)}`)}>Complement A</button>
        </div>
        {probResult && <p>Result: {probResult}</p>}
      </Card>

      <Card title="Binomial distribution">
        <NumberInput label="n" value={binN} onChange={setBinN} />
        <NumberInput label="p" value={binP} onChange={setBinP} />
        <NumberInput label="k" value={binK} onChange={setBinK} />
        <button onClick={() => setBinResult(`P(X=${binK}) = ${binomialProbability(binN, binP, binK)}; CDF = ${binomialCdf(binN, binP, binK)}`)}>
          Calculate
        </button>
        {binResult && <p>Result: {binResult}</p>}
      </Card>

      <Card title="Normal distribution">
        <NumberInput label="x" value={normX} onChange={setNormX} />
        <NumberInput label="mean" value={normMean} onChange={setNormMean} />
        <NumberInput label="std dev" value={normSd} onChange={setNormSd} />
        <button onClick={() => setNormResult(`PDF = ${normalPdf(normX, normMean, normSd)}; CDF = ${normalCdf(normX, normMean, normSd)}`)}>
          Calculate
        </button>
        {normResult && <p>Result: {normResult}</p>}
      </Card>

      <Card title="Method and accuracy limitations">
        <p>Sample variance divides by n-1; population variance divides by n.</p>
        <p>Percentiles use linear interpolation between order statistics.</p>
        <p>Mode returns all most-frequent values; an empty result means no repeated value.</p>
        <p>Distribution functions use double precision and an approximate normal CDF.</p>
        <p>Large datasets are capped at 100,000 entries.</p>
      </Card>
    </div>
  )
}

