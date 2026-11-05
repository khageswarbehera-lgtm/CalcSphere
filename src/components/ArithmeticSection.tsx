import { useCallback, useEffect, useState } from 'react'
import { create, all } from 'mathjs'
import { Card } from './UI'

const math = create(all)

export function ArithmeticSection() {
  const [expression, setExpression] = useState('')
  const [answer, setAnswer] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const check = useCallback(() => {
    if (!expression.trim()) return

    try {
      const normalized = expression
        .split('×').join('*')
        .split('÷').join('/')

      const evaluated = math.evaluate(normalized)
      if (typeof evaluated === 'number' && !Number.isFinite(evaluated)) {
        setAnswer('Division by zero')
        return
      }
      if (evaluated && typeof evaluated === 'object' && 'im' in evaluated && Number((evaluated as { im: number }).im) !== 0) {
        setAnswer('Domain error')
        return
      }
      const result = evaluated.toString()
      setAnswer(result)
      setHistory(items => [`${expression} = ${result}`, ...items].slice(0, 6))
    } catch {
      setAnswer('Invalid expression')
    }
  }, [expression])

  const addKey = (key: string) => setExpression(val => val + (key === '(' ? '()' : key))
  const clear = useCallback(() => {
    setExpression('')
    setAnswer('')
  }, [])
  const backspace = useCallback(() => setExpression(value => value.slice(0, -1)), [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        check()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        clear()
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        backspace()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [backspace, check, clear])

  const copyResult = async () => {
    if (!answer || !navigator.clipboard?.writeText) return
    await navigator.clipboard.writeText(answer)
    setAnswer('Copied')
  }

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
          <button onClick={backspace}>Backspace</button>
          <button onClick={clear}>Clear</button>
          {answer && answer !== 'Copied' && <button onClick={copyResult}>Copy result</button>}
        </div>
        {history.length > 0 && (
          <div className="history" aria-label="Calculation history">
            {history.map(entry => {
              const [savedExpression] = entry.split(' = ')
              return <button key={entry} onClick={() => setExpression(savedExpression)}>{entry}</button>
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
