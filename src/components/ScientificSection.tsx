import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getExactResult, formatDecimalResult } from '../calc/exactResults'
import { CalculationError, evaluateScientificValue } from '../calc'
import { Card } from './UI'
import { CalculatorResultPanel } from './CalculatorResultPanel'

const KEYS = [
  { label: 'AC', value: '', tone: 'utility', action: 'clear' },
  { label: '(', value: '(', tone: 'utility' },
  { label: ')', value: ')', tone: 'utility' },
  { label: '⌫', value: '', tone: 'utility', action: 'backspace', ariaLabel: 'Backspace' },
  { label: 'sin(', value: 'sin(', tone: 'function' },
  { label: 'cos(', value: 'cos(', tone: 'function' },
  { label: 'tan(', value: 'tan(', tone: 'function' },
  { label: '÷', value: '/', tone: 'operator' },
  { label: 'asin(', value: 'asin(', tone: 'function' },
  { label: 'acos(', value: 'acos(', tone: 'function' },
  { label: 'atan(', value: 'atan(', tone: 'function' },
  { label: '×', value: '*', tone: 'operator' },
  { label: 'log(', value: 'log(', tone: 'function' },
  { label: 'ln(', value: 'ln(', tone: 'function' },
  { label: 'exp(', value: 'exp(', tone: 'function' },
  { label: '−', value: '-', tone: 'operator' },
  { label: 'sqrt(', value: 'sqrt(', tone: 'function' },
  { label: '^', value: '^', tone: 'operator' },
  { label: '!', value: '!', tone: 'operator' },
  { label: '+', value: '+', tone: 'operator' },
  { label: 'π', value: 'pi', tone: 'utility' },
  { label: 'e', value: 'e', tone: 'utility' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '00', value: '00' },
  { label: '0', value: '0' },
  { label: '.', value: '.' },
]

type Key = {
  label: string
  value: string
  tone?: string
  action?: 'clear' | 'backspace'
  ariaLabel?: string
}

type CalculationResult = {
  exact?: string
  decimal?: string
  error?: string
}

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
  const [result, setResult] = useState<CalculationResult>()
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg')
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingCaret = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (pendingCaret.current === null || !inputRef.current) return
    const caret = pendingCaret.current
    pendingCaret.current = null
    inputRef.current.focus()
    inputRef.current.setSelectionRange(caret, caret)
  }, [expression])

  const calculate = useCallback(() => {
    if (!expression.trim()) {
      setResult(undefined)
      return
    }
    try {
      const numericValue = evaluateScientificValue(expression, { angleMode })
      const exact = getExactResult(expression, numericValue, { angleMode })
      const decimal = formatDecimalResult(numericValue)
      setResult({ exact, decimal })
      setHistory(items => [`${expression} = ${exact ?? decimal}`, ...items].slice(0, 6))
    } catch (error) {
      setResult({ error: errorMessage(error) })
    }
    setCopied(false)
  }, [angleMode, expression])

  const clear = useCallback(() => {
    pendingCaret.current = 0
    setExpression('')
    setResult(undefined)
    setCopied(false)
  }, [])

  const backspace = useCallback(() => {
    const input = inputRef.current
    let start = input?.selectionStart ?? expression.length
    const end = input?.selectionEnd ?? start
    if (start === end && start > 0) start -= 1
    if (start === end) return
    pendingCaret.current = start
    setExpression(`${expression.slice(0, start)}${expression.slice(end)}`)
    setResult(undefined)
    setCopied(false)
  }, [expression])

  const insertKey = useCallback((key: string) => {
    const input = inputRef.current
    const start = input?.selectionStart ?? expression.length
    const end = input?.selectionEnd ?? start
    pendingCaret.current = start + key.length
    setExpression(`${expression.slice(0, start)}${key}${expression.slice(end)}`)
    setResult(undefined)
    setCopied(false)
  }, [expression])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        calculate()
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
  }, [backspace, calculate, clear])

  const copyResult = useCallback(async () => {
    const value = result?.exact ?? result?.decimal
    if (!value || !navigator.clipboard?.writeText) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }, [result])

  return (
    <div className="grid math-grid calculator-layout">
      <Card title="Scientific">
        <div className="angle-mode">
          <span>Angle mode: {angleMode === 'deg' ? 'Degrees' : 'Radians'}</span>
          <button
            type="button"
            onClick={() => {
              setAngleMode(mode => (mode === 'deg' ? 'rad' : 'deg'))
              setResult(undefined)
            }}
          >
            Switch to {angleMode === 'deg' ? 'Radians' : 'Degrees'}
          </button>
        </div>

        <div className="display-area calculator-display">
          <input
            ref={inputRef}
            id="scientific-expression"
            className="expression"
            value={expression}
            onChange={event => {
              setExpression(event.target.value)
              setResult(undefined)
              setCopied(false)
            }}
            placeholder="0"
            aria-label="Scientific expression"
          />
          <CalculatorResultPanel
            expression={expression}
            exactResult={result?.exact}
            decimalResult={result?.decimal}
            error={result?.error}
          />
        </div>

        <div className="keypad calculator-keypad scientific-keypad">
          {(KEYS as Key[]).map(key => (
            <button
              key={key.label}
              type="button"
              className={key.tone ? `key-${key.tone}` : 'key-number'}
              aria-label={key.ariaLabel}
              onClick={() => {
                if (key.action === 'clear') clear()
                else if (key.action === 'backspace') backspace()
                else insertKey(key.value)
              }}
            >
              {key.label}
            </button>
          ))}
          <button type="button" className="key-equals scientific-equals" onClick={calculate}>=</button>
        </div>

        <div className="calculator-tools">
          {result?.decimal && <button type="button" onClick={copyResult}>Copy result</button>}
          {copied && <span className="copy-feedback" role="status">Copied</span>}
        </div>

        {history.length > 0 && (
          <div className="history" aria-label="Calculation history">
            {history.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setExpression(item.split(' = ')[0])
                  setResult(undefined)
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
