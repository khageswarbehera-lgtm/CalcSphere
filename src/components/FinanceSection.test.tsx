import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FinanceSection } from './FinanceSection'

describe('FinanceSection', () => {
  it('computes EMI, total payment and FD maturity for the default inputs', () => {
    render(<FinanceSection />)
    expect(screen.getByText('Monthly EMI: ₹10,258')).toBeInTheDocument()
    expect(screen.getByText('Total Payment: ₹6,15,496')).toBeInTheDocument()
    expect(screen.getByText('FD Maturity: ₹7,51,828')).toBeInTheDocument()
  })

  it('handles a zero interest rate', () => {
    render(<FinanceSection />)
    fireEvent.change(screen.getByDisplayValue('8.5'), { target: { value: '0' } })
    expect(screen.getByText('Monthly EMI: ₹8,333')).toBeInTheDocument()
    expect(screen.getByText('Total Payment: ₹5,00,000')).toBeInTheDocument()
    expect(screen.getByText('FD Maturity: ₹5,00,000')).toBeInTheDocument()
  })

  it('handles decimal inputs', () => {
    render(<FinanceSection />)
    fireEvent.change(screen.getByDisplayValue('500000'), { target: { value: '1000.5' } })
    fireEvent.change(screen.getByDisplayValue('8.5'), { target: { value: '4.25' } })
    fireEvent.change(screen.getByDisplayValue('5'), { target: { value: '2' } })
    // Just ensure values render without crashing and FD maturity is formatted
    expect(screen.getByText(/FD Maturity: ₹/)).toBeInTheDocument()
  })

  it('handles zero years without dividing by zero', () => {
    render(<FinanceSection />)
    fireEvent.change(screen.getByDisplayValue('5'), { target: { value: '0' } })
    expect(screen.getByText('Monthly EMI: ₹0')).toBeInTheDocument()
    expect(screen.getByText('Total Payment: ₹0')).toBeInTheDocument()
  })
})