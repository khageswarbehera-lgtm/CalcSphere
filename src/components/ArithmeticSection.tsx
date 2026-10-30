import { useMemo, useState } from 'react'
import { create, all } from 'mathjs'
import { Card } from './UI'

const math = create(all)

export function ArithmeticSection() {
  const [expression, setExpression] = useState('')
  const [answer, setAnswer] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const check = () => {
    if (!expression.trim()) return

    try {
      const normalized = expression
        .split('×').join('*')
        .split('÷').join('/')

      const result = math.evaluate(normalized).toString()
      setAnswer(result)
      setHistory(items => [`${expression} = ${result}`, ...items].slice(0, 6))
    } catch {
      setAnswer('Invalid expression')
    }
  }

  const addKey = (key: string) => setExpression(val => val + (key === '(' ? '()' : key))

  const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '(', ')', '+', '^', '!', '/']

  return (
    <div className="grid math-grid">
      <Card title="Arithmetic">
        <div className="display-area">
          <input 
            className="expression" 
            value={expression} 
            onChange={e => setExpression(e.target.value)}
            placeholder="0"
          />
          {answer && <output className="result">{answer}</output>}
        </div>

        <div className="keypad">
          {keys.map(key => <button key={key} onClick={() => addKey(key)}>{key}</button>)}
        </div>

        <div className="action-buttons">
          <button className="primary" onClick={check}>Calculate</button>
          <button onClick={() => {setExpression(''); setAnswer('')}}>Clear</button>
        </div>
      </Card>
    </div>
  )
}
