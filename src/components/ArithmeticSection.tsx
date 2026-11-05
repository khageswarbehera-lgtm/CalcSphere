import { useCallback, useEffect, useState } from 'react'
import { create, all } from 'mathjs'
import { Card } from './UI'

const math = create(all)

export function ArithmeticSection() {
  const [expression, setExpression] = useState('')
  const [answer, setAnswer] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

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
      setCopied(false)
      setHistory(items => [`${expression} = ${result}`, ...items].slice(0, 6))
    } catch {
      setAnswer('Invalid expression')
      setCopied(false)
    }
  }, [expression])

  const addKey = (key: string) => setExpression(val => val + (key === '(' ? '()' : key))
  const clear = useCallback(() => {
    setExpression('')
    setAnswer('')
    setCopied(false)
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
    if (!answer || ['Division by zero', 'Domain error', 'Invalid expression'].includes(answer) || !navigator.clipboard?.writeText) return
    await navigator.clipboard.writeText(answer)
    setCopied(true)
  }

  const keys = [
    { label: 'AC', action: clear, tone: 'utility' },
    { label: '%', value: '%', tone: 'utility' },
    { label: '⌫', action: backspace, tone: 'utility', ariaLabel: 'Backspace' },
    { label: '÷', value: '÷', tone: 'operator' },
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '×', value: '×', tone: 'operator' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '−', value: '-', tone: 'operator' },
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '+', value: '+', tone: 'operator' },
    { label: '00', value: '00' }, { label: '0', value: '0' }, { label: '.', value: '.' }, { label: '=', action: check, tone: 'equals' },
  ]

  return (
    <div className="grid math-grid calculator-layout">
      <Card title="Arithmetic">
        <div className="display-area calculator-display">
          <input 
            className="expression" 
            value={expression} 
            onChange={e => setExpression(e.target.value)}
            placeholder="0"
            aria-label="Arithmetic expression"
          />
          <div className="display-result" aria-live="polite">
            <span>Result</span>
            {answer && <output className={`result${['Division by zero', 'Domain error', 'Invalid expression'].includes(answer) ? ' result--error' : ''}`}>{answer}</output>}
          </div>
        </div>

        <div className="keypad calculator-keypad">
          {keys.map(key => (
            <button
              key={key.label}
              type="button"
              className={key.tone ? `key-${key.tone}` : 'key-number'}
              aria-label={key.ariaLabel}
              onClick={() => key.action ? key.action() : addKey(key.value!)}
            >
              {key.label}
            </button>
          ))}
        </div>

        <div className="calculator-tools">
          {answer && <button type="button" onClick={copyResult}>Copy result</button>}
          {copied && <span className="copy-feedback" role="status">Copied</span>}
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
