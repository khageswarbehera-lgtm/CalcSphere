import { useState } from 'react'
import { Card, NumberInput } from './UI'
import { complexAdd, complexDivide, complexMultiply, complexSubtract, complexToString, conjugate, magnitude as complexMagnitude, argument as complexArgument, differentiate, integrate, solveEquation, solveLinear, solveQuadratic } from '../calc'

export function AdvancedSection() {
  const [equation, setEquation] = useState('x^2 - 5*x + 6')
  const [variable, setVariable] = useState('x')
  const [calculus, setCalculus] = useState('x^3 + 2*x')
  const [linA, setLinA] = useState(2)
  const [linB, setLinB] = useState(-4)
  const [linResult, setLinResult] = useState('')
  const [quadA, setQuadA] = useState(1)
  const [quadB, setQuadB] = useState(-5)
  const [quadC, setQuadC] = useState(6)
  const [answer, setAnswer] = useState('')
  const [quadResult, setQuadResult] = useState('')
  const [z1re, setZ1re] = useState(3)
  const [z1im, setZ1im] = useState(4)
  const [z2re, setZ2re] = useState(1)
  const [z2im, setZ2im] = useState(-2)
  const [complexResult, setComplexResult] = useState('')

  const solve = () => {
    try {
      const result = solveEquation(equation, variable)
      setAnswer(`Solutions: ${result}`)
    } catch {
      setAnswer('Unable to solve equation')
    }
  }

  const calculate = (action: 'differentiate' | 'integrate') => {
    try {
      const result = action === 'differentiate'
        ? differentiate(calculus, variable)
        : integrate(calculus, variable)
      setAnswer(`${action === 'differentiate' ? 'Derivative' : 'Integral'}: ${result}`)
    } catch {
      setAnswer('Unable to calculate')
    }
  }

  return (
    <div className="grid math-grid">
      <Card title="Symbolic solver (polynomials and equations)">
        <input aria-label="Equation" value={equation} onChange={e => setEquation(e.target.value)} />
        <input aria-label="Variable" value={variable} onChange={e => setVariable(e.target.value)} />
        <button onClick={solve}>Solve</button>
      </Card>
      <Card title="Calculus">
        <input aria-label="Calculus expression" value={calculus} onChange={e => setCalculus(e.target.value)} />
        <button onClick={() => calculate('differentiate')}>Differentiate</button>
        <button onClick={() => calculate('integrate')}>Integrate</button>
        {answer && <output className="result" role="status" aria-live="polite">{answer}</output>}
      </Card>
      <Card title="Linear equation (a x + b = 0)">
        <NumberInput label="a" value={linA} onChange={setLinA} />
        <NumberInput label="b" value={linB} onChange={setLinB} />
        <p>Formula: x = -b ÷ a</p>
        <button onClick={() => {
          const r = solveLinear(linA, linB)
          if (r.kind === 'one') setLinResult(`Solution: x = ${r.root} (1 root)`)
          else if (r.kind === 'infinite') setLinResult('Infinite solutions (identity)')
          else setLinResult('No solution')
        }}>Solve linear</button>
        {linResult && <p>{linResult}</p>}
      </Card>

      <Card title="Quadratic equation (a x² + b x + c = 0)">
        <NumberInput label="a" value={quadA} onChange={setQuadA} />
        <NumberInput label="b" value={quadB} onChange={setQuadB} />
        <NumberInput label="c" value={quadC} onChange={setQuadC} />
        <p>Formula: x = (-b ± √(b² − 4ac)) / (2a)</p>
        <button onClick={() => {
          const r = solveQuadratic(quadA, quadB, quadC)
          setQuadResult(`Discriminant: ${r.discriminant}; ${r.status}; roots: ${r.roots.join(', ')}; method: ${r.method}`)
        }}>Solve quadratic</button>
        {quadResult && <p>{quadResult}</p>}
      </Card>
      <Card title="Complex numbers">
        <NumberInput label="z1 real" value={z1re} onChange={setZ1re} />
        <NumberInput label="z1 imag" value={z1im} onChange={setZ1im} />
        <NumberInput label="z2 real" value={z2re} onChange={setZ2re} />
        <NumberInput label="z2 imag" value={z2im} onChange={setZ2im} />
        <p>Exact symbolic-style complex arithmetic (numerical).</p>
        <div className="action-buttons">
          <button onClick={() => {
            const z1 = { re: z1re, im: z1im }; const z2 = { re: z2re, im: z2im }
            setComplexResult(`Add: ${complexToString(complexAdd(z1, z2))}`)
          }}>Add</button>
          <button onClick={() => {
            const z1 = { re: z1re, im: z1im }; const z2 = { re: z2re, im: z2im }
            setComplexResult(`Subtract: ${complexToString(complexSubtract(z1, z2))}`)
          }}>Subtract</button>
          <button onClick={() => {
            const z1 = { re: z1re, im: z1im }; const z2 = { re: z2re, im: z2im }
            setComplexResult(`Multiply: ${complexToString(complexMultiply(z1, z2))}`)
          }}>Multiply</button>
          <button onClick={() => {
            try {
              const z1 = { re: z1re, im: z1im }; const z2 = { re: z2re, im: z2im }
              setComplexResult(`Divide: ${complexToString(complexDivide(z1, z2))}`)
            } catch (e: any) { setComplexResult(e?.message ?? 'Invalid input') }
          }}>Divide</button>
          <button onClick={() => {
            const z1 = { re: z1re, im: z1im }
            setComplexResult(`Conjugate: ${complexToString(conjugate(z1))}; |z|: ${complexMagnitude(z1)}; arg: ${complexArgument(z1)}`)
          }}>Conjugate / magnitude / arg</button>
        </div>
        {complexResult && <p>{complexResult}</p>}
      </Card>
    </div>
  )
}
