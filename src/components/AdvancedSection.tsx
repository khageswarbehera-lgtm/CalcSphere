import { useState } from 'react'
import nerdamer from 'nerdamer/all'
import { Card } from './UI'

export function AdvancedSection() {
  const [equation, setEquation] = useState('x^2 - 5*x + 6')
  const [variable, setVariable] = useState('x')
  const [calculus, setCalculus] = useState('x^3 + 2*x')
  const [answer, setAnswer] = useState('')

  const solve = () => {
    try {
      const result = nerdamer.solve(equation, variable).toString()
      setAnswer(`Solutions: ${result}`)
    } catch {
      setAnswer('Unable to solve equation')
    }
  }

  const calculate = (action: 'differentiate' | 'integrate') => {
    try {
      const result = action === 'differentiate' 
        ? nerdamer(`diff(${calculus},${variable})`) 
        : nerdamer(`integrate(${calculus},${variable})`)
      setAnswer(`${action === 'differentiate' ? 'Derivative' : 'Integral'}: ${result}`)
    } catch {
      setAnswer('Unable to calculate')
    }
  }

  return (
    <div className="grid math-grid">
      <Card title="Equations">
        <input value={equation} onChange={e => setEquation(e.target.value)} />
        <input value={variable} onChange={e => setVariable(e.target.value)} />
        <button onClick={solve}>Solve</button>
      </Card>
      <Card title="Calculus">
        <input value={calculus} onChange={e => setCalculus(e.target.value)} />
        <button onClick={() => calculate('differentiate')}>Differentiate</button>
        <button onClick={() => calculate('integrate')}>Integrate</button>
        {answer && <output className="result">{answer}</output>}
      </Card>
    </div>
  )
}
