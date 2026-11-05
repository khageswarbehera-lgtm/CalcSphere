import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { create, all } from 'mathjs'
import { getExactResult, formatDecimalResult } from '../calc/exactResults'
import { Card } from './UI'
import { CalculatorResultPanel } from './CalculatorResultPanel'

const math = create(all)

type CalculationResult = {
  exact?: string
  decimal?: string
  error?: string
}

type Key = {
  label: string
  value?: string
  tone?: string
  action?: () => void
  ariaLabel?: string
}

export function ArithmeticSection() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<CalculationResult>()
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

  const check = useCallback(() => {
    if (!expression.trim()) {
      setResult(undefined)
      return
    }

    let depth = 0
    for (const character of expression) {
      if (character === '(') depth += 1
      if (character === ')') depth -= 1
      if (depth < 0) {
        setResult({ error: 'Unmatched parentheses' })
        return
      }
    }
    if (depth !== 0) {
      setResult({ error: 'Unmatched parentheses' })
      return
    }

    try {
      const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/')
      const evaluated = math.evaluate(normalized)
      if (evaluated && typeof evaluated === 'object' && 'im' in evaluated && Number((evaluated as { im: number }).im) !== 0) {
        setResult({ error: 'Domain error' })
        return
      }
      const numericValue = Number(evaluated)
      if (!Number.isFinite(numericValue)) {
        setResult({ error: 'Division by zero' })
        return
      }
      const exact = getExactResult(normalized, numericValue)
      const decimal = formatDecimalResult(numericValue)
      setResult({ exact, decimal })
      setCopied(false)
      setHistory(items => [`${expression} = ${exact ?? decimal}`, ...items].slice(0, 6))
    } catch {
      setResult({ error: 'Invalid expression' })
      setCopied(false)
    }
  }, [expression])

  const insertKey = useCallback((key: string) => {
    const input = inputRef.current
    const start = input?.selectionStart ?? expression.length
    const end = input?.selectionEnd ?? start
    const nextExpression = `${expression.slice(0, start)}${key}${expression.slice(end)}`
    pendingCaret.current = start + key.length
    setExpression(nextExpression)
    setResult(undefined)
    setCopied(false)
  }, [expression])

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
    const value = result?.exact ?? result?.decimal
    if (!value || !navigator.clipboard?.writeText) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
  }

  const keys: Key[] = [
    { label: 'AC', action: clear, tone: 'utility' },
    { label: '(', value: '(', tone: 'utility' },
    { label: ')', value: ')', tone: 'utility' },
    { label: '⌫', action: backspace, tone: 'utility', ariaLabel: 'Backspace' },
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '÷', value: '÷', tone: 'operator' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '×', value: '×', tone: 'operator' },
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '−', value: '-', tone: 'operator' },
    { label: '00', value: '00' }, { label: '0', value: '0' }, { label: '.', value: '.' }, { label: '+', value: '+', tone: 'operator' },
    { label: '%', value: '%', tone: 'utility' }, { label: '^', value: '^', tone: 'operator' }, { label: '!', value: '!', tone: 'operator' }, { label: '=', action: check, tone: 'equals' },
  ]

  return (
    <div className="grid math-grid calculator-layout">
      <Card title="Arithmetic">
        <div className="display-area calculator-display">
          <input
            ref={inputRef}
            className="expression"
            value={expression}
            onChange={event => {
              setExpression(event.target.value)
              setResult(undefined)
              setCopied(false)
            }}
            placeholder="0"
            aria-label="Arithmetic expression"
          />
          <CalculatorResultPanel
            expression={expression}
            exactResult={result?.exact}
            decimalResult={result?.decimal}
            error={result?.error}
          />
        </div>

        <div className="keypad calculator-keypad">
          {keys.map(key => (
            <button
              key={key.label}
              type="button"
              className={key.tone ? `key-${key.tone}` : 'key-number'}
              aria-label={key.ariaLabel}
              onClick={() => key.action ? key.action() : insertKey(key.value ?? key.label)}
            >
              {key.label}
            </button>
          ))}
        </div>

        <div className="calculator-tools">
          {result?.decimal && <button type="button" onClick={copyResult}>Copy result</button>}
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
