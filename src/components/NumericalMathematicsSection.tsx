import { useState } from 'react'
import { Card, NumberInput } from './UI'
import {
  arithmeticSeriesSum,
  bisection,
  geometricSeriesInfiniteSum,
  geometricSeriesSum,
  limit,
  newtonRaphson,
  simpsonIntegral,
  summation,
  trapezoidalIntegral,
} from '../calc'

export function NumericalMathematicsSection() {
  const [limitExpr, setLimitExpr] = useState('sin(x)/x')
  const [limitVar, setLimitVar] = useState('x')
  const [limitPoint, setLimitPoint] = useState('0')
  const [limitResult, setLimitResult] = useState('')

  const [sumExpr, setSumExpr] = useState('i^2')
  const [sumVar, setSumVar] = useState('i')
  const [sumStart, setSumStart] = useState(1)
  const [sumEnd, setSumEnd] = useState(5)
  const [sumResult, setSumResult] = useState('')

  const [arithFirst, setArithFirst] = useState(2)
  const [arithDiff, setArithDiff] = useState(3)
  const [arithTerms, setArithTerms] = useState(4)
  const [arithResult, setArithResult] = useState('')

  const [geoFirst, setGeoFirst] = useState(1)
  const [geoRatio, setGeoRatio] = useState(0.5)
  const [geoTerms, setGeoTerms] = useState(4)
  const [geoResult, setGeoResult] = useState('')

  const [rootExpr, setRootExpr] = useState('x^2 - 2')
  const [rootA, setRootA] = useState(1)
  const [rootB, setRootB] = useState(2)
  const [rootGuess, setRootGuess] = useState(1.5)
  const [rootTol, setRootTol] = useState(0.0000000001)
  const [rootIter, setRootIter] = useState(100)
  const [rootResult, setRootResult] = useState('')

  const [intExpr, setIntExpr] = useState('x^2')
  const [intA, setIntA] = useState(0)
  const [intB, setIntB] = useState(1)
  const [intN, setIntN] = useState(100)
  const [intResult, setIntResult] = useState('')

  const run = (fn: () => void) => {
    try {
      fn()
    } catch (e: any) {
      setRootResult(e?.message ?? 'Invalid input')
    }
  }

  return (
    <div className="grid math-grid">
      <Card title="Limits (symbolic, with unsupported detection)">
        <input aria-label="Limit expression" value={limitExpr} onChange={e => setLimitExpr(e.target.value)} placeholder="expression" />
        <input aria-label="Limit variable" value={limitVar} onChange={e => setLimitVar(e.target.value)} placeholder="variable" />
        <input aria-label="Limit point" value={limitPoint} onChange={e => setLimitPoint(e.target.value)} placeholder="point" />
        <p>Uses a CAS; if it cannot resolve the limit, an explicit unsupported result is returned.</p>
        <button onClick={() => setLimitResult(limit(limitExpr, limitVar, limitPoint === 'Infinity' || limitPoint === '-Infinity' ? limitPoint : Number(limitPoint)))}>
          Limit
        </button>
        {limitResult && <p>Result: {limitResult}</p>}
      </Card>

      <Card title="Summation">
        <input aria-label="Summation expression" value={sumExpr} onChange={e => setSumExpr(e.target.value)} placeholder="expression in index" />
        <input aria-label="Summation variable" value={sumVar} onChange={e => setSumVar(e.target.value)} placeholder="index variable" />
        <NumberInput label="start" value={sumStart} onChange={setSumStart} />
        <NumberInput label="end" value={sumEnd} onChange={setSumEnd} />
        <button onClick={() => setSumResult(String(summation(sumExpr, sumVar, sumStart, sumEnd)))}>Sum</button>
        {sumResult && <p>Result: {sumResult}</p>}
      </Card>

      <Card title="Arithmetic series">
        <NumberInput label="first term" value={arithFirst} onChange={setArithFirst} />
        <NumberInput label="common difference" value={arithDiff} onChange={setArithDiff} />
        <NumberInput label="terms" value={arithTerms} onChange={setArithTerms} />
        <p>Sum = n/2 * (2a + (n-1)d</p>
        <button onClick={() => setArithResult(String(arithmeticSeriesSum(arithFirst, arithDiff, arithTerms)))}>Arithmetic sum</button>
        {arithResult && <p>Result: {arithResult}</p>}
      </Card>
      <Card title="Geometric series">
        <NumberInput label="first term" value={geoFirst} onChange={setGeoFirst} />
        <NumberInput label="common ratio" value={geoRatio} onChange={setGeoRatio} />
        <NumberInput label="terms" value={geoTerms} onChange={setGeoTerms} />
        <div className="action-buttons">
          <button onClick={() => setGeoResult(String(geometricSeriesSum(geoFirst, geoRatio, geoTerms)))}>Finite sum</button>
          <button onClick={() => {
            try { setGeoResult(String(geometricSeriesInfiniteSum(geoFirst, geoRatio))) }
            catch (e: any) { setGeoResult(e?.message ?? 'Divergent') }
          }}>Infinite sum</button>
        </div>
        {geoResult && <p>Result: {geoResult}</p>}
        <p>Converges only when |r| &lt; 1.</p>
      </Card>

      <Card title="Root finding">
        <input aria-label="Root function" value={rootExpr} onChange={e => setRootExpr(e.target.value)} placeholder="f(x)" />
        <NumberInput label="lower bound (bisection)" value={rootA} onChange={setRootA} />
        <NumberInput label="upper bound (bisection)" value={rootB} onChange={setRootB} />
        <NumberInput label="initial guess (Newton)" value={rootGuess} onChange={setRootGuess} />
        <NumberInput label="tolerance" value={rootTol} onChange={setRootTol} />
        <NumberInput label="max iterations" value={rootIter} onChange={setRootIter} />
        <div className="action-buttons">
          <button onClick={() => run(() => {
            const r = bisection(rootExpr, rootA, rootB, rootTol, rootIter)
            setRootResult(`Bisection: root=${r.root}, converged=${r.converged}, iterations=${r.iterations}, ${r.message}`)
          })}>Bisect</button>
          <button onClick={() => run(() => {
            const r = newtonRaphson(rootExpr, rootGuess, rootTol, rootIter)
            setRootResult(`Newton: root=${r.root}, converged=${r.converged}, iterations=${r.iterations}, ${r.message}`)
          })}>Newton</button>
        </div>
        {rootResult && <p role="status" aria-live="polite">Result: {rootResult}</p>}
        <p>Bisection requires a sign change; Newton-Raphson safeguards against a zero derivative.</p>
      </Card>

      <Card title="Numerical integration">
        <input aria-label="Integration function" value={intExpr} onChange={e => setIntExpr(e.target.value)} placeholder="f(x)" />
        <NumberInput label="a" value={intA} onChange={setIntA} />
        <NumberInput label="b" value={intB} onChange={setIntB} />
        <NumberInput label="intervals" value={intN} onChange={setIntN} />
        <div className="action-buttons">
          <button onClick={() => setIntResult(`Trapezoidal: ${trapezoidalIntegral(intExpr, intA, intB, intN)}`)}>Trapezoidal</button>
          <button onClick={() => setIntResult(`Simpson: ${simpsonIntegral(intExpr, intA, intB, intN)}`)}>Simpson</button>
        </div>
        {intResult && <p>Result: {intResult}</p>}
      </Card>

      <Card title="Method and accuracy limitations">
        <p>Bisection converges linearly and needs a bracketing interval with a sign change.</p>
        <p>Newton-Raphson converges quadratically near a simple root but may fail for poor initial guesses or zero derivatives.</p>
        <p>Summations and series are evaluated in double precision; rounding errors accumulate for large ranges.</p>
        <p>Integration uses fixed subintervals; accuracy depends on interval count and smoothness; Simpson requires an even number of intervals.</p>
        <p>Limits are resolved symbolically; unsupported cases are reported rather than approximated.</p>
      </Card>
    </div>
  )
}

