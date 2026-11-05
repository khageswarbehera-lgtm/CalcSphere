import { useCallback, useState } from 'react'
import { Card } from './UI'
import { CalculationError, evaluateScientific } from '../calc'

const KEYS = [
  'sin(', 'cos(', 'tan(',
  'asin(', 'acos(', 'atan(',
  'log(', 'ln(', 'exp(',
  'sqrt(', '^', '!',
  'pi', 'e', '(',
  ')', '7', '8', '9',
  '/', '4', '5', '6',
  '*', '1', '2', '3',
  '-', '0', '.', '+',
]

function errorMessage(error: unknown): string {
  if (error instanceof CalculationError) {
    switch (error.code) {
      case 'DIVISION_BY_ZERO':
        return 'Division by zero'
      case 'DOMAIN_ERROR':
        return 'Domain error'
      case 'PARSE_ERROR':
        return 'Invalid expression'
      case 'OVERFLOW':
        return 'Overflow'
      case 'UNSUPPORTED_SYNTAX':
        return 'Unsupported syntax'
      default:
        return error.message || 'Invalid expression'
    }
  }
  return 'Invalid expression'
}

export function ScientificSection() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg')
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const calculate = useCallback(() => {
    if (!expression.trim()) {
      setResult('')
      return
    }
    try {
      const value = evaluateScientific(expression, { angleMode })
      setResult(value)
      setHistory(items => [`${expression} = ${value}`, ...items].slice(0, 6))
    } catch (error) {
      setResult(errorMessage(error))
    }
  }, [angleMode, expression])

  const clear = useCallback(() => {
    setExpression('')
    setResult('')
    setCopied(false)
  }, [])

  const backspace = useCallback(() => {
    setExpression(value => value.slice(0, -1))
  }, [])

  const appendKey = useCallback((key: string) => {
    setExpression(value => value + key)
  }, [])

  const copyResult = useCallback(async () => {
    if (!result || result === 'Division by zero' || result === 'Invalid expression' || result === 'Domain error' || result === 'Overflow') {
      return
    }
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }, [result])

  return (
    <div className="grid math-grid">
      <Card title="Scientific">
        <div className="angle-mode">
          <span>Angle mode: {angleMode === 'deg' ? 'Degrees' : 'Radians'}</span>
          <button onClick={() => setAngleMode(mode => (mode === 'deg' ? 'rad' : 'deg'))}>
            Switch to {angleMode === 'deg' ? 'Radians' : 'Degrees'}
          </button>
        </div>

        <div className="display-area">
          <input
            id="scientific-expression"
            className="expression"
            value={expression}
            onChange={event => setExpression(event.target.value)}
            placeholder="0"
            aria-label="Scientific expression"
          />
          {result && <output className="result">{result}</output>}
        </div>

        <div className="keypad">
          {KEYS.map(key => (
            <button key={key} onClick={() => appendKey(key)}>{key}</button>
          ))}
        </div>

        <div className="action-buttons">
          <button className="primary" onClick={calculate}>Calculate</button>
          <button onClick={clear}>Clear</button>
          <button onClick={backspace}>Backspace</button>
          <button onClick={copyResult} disabled={!result}>Copy result</button>
          {copied && <span className="copy-feedback">Copied</span>}
        </div>

        {history.length > 0 && (
          <ul className="history">
            {history.map(item => (
              <li key={item}>
                <button type="button" onClick={() => setExpression(item.split(' = ')[0])}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}