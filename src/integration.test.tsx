import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { ArithmeticSection } from './components/ArithmeticSection'
import { CalculatorDirectorySection } from './components/CalculatorDirectorySection'
import App from './App'

describe('integration: navigation', () => {
  it('renders the primary navigation labels', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Arithmetic' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Function Graphing' })).toBeInTheDocument()
  })

  it('filters the calculator directory by query', async () => {
    render(<CalculatorDirectorySection />)
    const input = screen.getByLabelText('Search calculator directory')
    fireEvent.change(input, { target: { value: 'zzzz-no-match' } })
    expect(await screen.findByText(/No calculators match/i)).toBeInTheDocument()
  })
})

describe('integration: arithmetic keyboard', () => {
  it('calculates with Enter and clears with Escape', async () => {
    render(<ArithmeticSection />)
    const input = screen.getByPlaceholderText('0')
    fireEvent.change(input, { target: { value: '2 + 3' } })
    fireEvent.keyDown(window, { key: 'Enter' })
    await waitFor(() => {
      expect(document.querySelector('output.result')).toHaveTextContent('5')
    })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(input).toHaveValue('')
  })
})

describe('integration: history persistence', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('persists records across reloads', async () => {
    const { loadHistory, addHistoryRecord } = await import('./calc')
    const state = addHistoryRecord({ version: 1, records: [] } as any, { calculator: 'Arithmetic', result: '5' })
    localStorage.setItem('calcspace:calculation-history', JSON.stringify(state))

    const reloaded = loadHistory()
    expect(reloaded.records).toHaveLength(1)
    expect(reloaded.records[0].calculator).toBe('Arithmetic')
  })
})

describe('integration: unit converter boundaries', () => {
  it('converts zero and rejects incompatible units', async () => {
    const { convertUnit } = await import('./calc')
    expect(convertUnit(0, 'm', 'ft')).toBe(0)
    expect(() => convertUnit(1, 'm', 'kg')).toThrow()
  })
})


