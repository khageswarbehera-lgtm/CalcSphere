import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ArithmeticSection } from './ArithmeticSection'

function resultText() {
  return document.querySelector('output.result')?.textContent ?? null
}

function calculate(expression: string) {
  render(<ArithmeticSection />)
  fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: expression } })
  fireEvent.click(screen.getByRole('button', { name: '=' }))
}

describe('ArithmeticSection', () => {
  it('adds two integers', () => {
    calculate('2 + 3')
    expect(resultText()).toBe('5')
  })

  it('handles decimal values', () => {
    calculate('2.5 * 4')
    expect(resultText()).toBe('10')
  })

  it('handles negative values', () => {
    calculate('10 - 15')
    expect(resultText()).toBe('-5')
  })

  it('normalizes multiplication symbols', () => {
    calculate('2×3')
    expect(resultText()).toBe('6')
  })

  it('normalizes division symbols', () => {
    calculate('6÷2')
    expect(resultText()).toBe('3')
  })

  it('evaluates powers', () => {
    calculate('2^3')
    expect(resultText()).toBe('8')
  })

  it('evaluates square roots', () => {
    calculate('sqrt(9)')
    expect(resultText()).toBe('3')
  })

  it('evaluates cube roots', () => {
    calculate('cbrt(27)')
    expect(resultText()).toBe('3')
  })

  it('evaluates factorials', () => {
    calculate('5!')
    expect(resultText()).toBe('120')
  })

  it('handles percentages as postfix fractions', () => {
    calculate('50%')
    expect(resultText()).toBe('0.5')
  })

  it('evaluates logarithms', () => {
    calculate('log(100)')
    expect(Number(resultText())).toBeCloseTo(4.605, 2)
  })

  it('reports division by zero', () => {
    calculate('1 / 0')
    expect(resultText()).toBe('Division by zero')
  })

  it('reports invalid expressions', () => {
    calculate('abc')
    expect(resultText()).toBe('Invalid expression')
  })

  it('reports domain errors', () => {
    calculate('sqrt(-1)')
    expect(resultText()).toBe('Domain error')
  })

  it('shows nothing for an empty expression', () => {
    render(<ArithmeticSection />)
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('output.result')).toBeNull()
  })

  it('clears the expression', () => {
    render(<ArithmeticSection />)
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'AC' }))
    expect(screen.getByPlaceholderText('0')).toHaveValue('')
    expect(document.querySelector('output.result')).toBeNull()
  })

  it('backspaces the last character', () => {
    render(<ArithmeticSection />)
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Backspace' }))
    expect(screen.getByPlaceholderText('0')).toHaveValue('12')
  })

  it('supports keyboard Enter to calculate', () => {
    render(<ArithmeticSection />)
    const input = screen.getByPlaceholderText('0')
    fireEvent.change(input, { target: { value: '2 + 3' } })
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(resultText()).toBe('5')
  })

  it('supports keyboard Backspace', () => {
    render(<ArithmeticSection />)
    const input = screen.getByPlaceholderText('0')
    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.keyDown(window, { key: 'Backspace' })
    expect(input).toHaveValue('12')
  })

  it('supports keyboard Escape to clear', () => {
    render(<ArithmeticSection />)
    const input = screen.getByPlaceholderText('0')
    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(input).toHaveValue('')
  })

  it('records history and allows reuse', () => {
    calculate('2 + 3')
    expect(screen.getByText('2 + 3 = 5')).toBeInTheDocument()
    fireEvent.click(screen.getByText('2 + 3 = 5'))
    expect(screen.getByPlaceholderText('0')).toHaveValue('2 + 3')
  })

  it('copies result when clipboard is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    calculate('2 + 3')
    fireEvent.click(screen.getByRole('button', { name: 'Copy result' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('5'))
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })

  it('handles keypad clicks', () => {
    render(<ArithmeticSection />)
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(resultText()).toBe('10')
  })
})
