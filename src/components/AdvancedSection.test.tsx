import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AdvancedSection } from './AdvancedSection'

describe('AdvancedSection', () => {
  it('solves the default equation', () => {
    render(<AdvancedSection />)
    fireEvent.click(screen.getByRole('button', { name: 'Solve' }))
    expect(screen.getByText('Solutions: [2,3]')).toBeInTheDocument()
  })

  it('differentiates the default expression', () => {
    render(<AdvancedSection />)
    fireEvent.click(screen.getByRole('button', { name: 'Differentiate' }))
    expect(screen.getByText('Derivative: 2+3*x^2')).toBeInTheDocument()
  })

  it('integrates the default expression', () => {
    render(<AdvancedSection />)
    fireEvent.click(screen.getByRole('button', { name: 'Integrate' }))
    expect(screen.getByText('Integral: (1/4)*x^4+x^2')).toBeInTheDocument()
  })

  it('reports an error for an invalid equation', () => {
    render(<AdvancedSection />)
    fireEvent.change(screen.getByDisplayValue('x^2 - 5*x + 6'), { target: { value: 'x^2 +' } })
    fireEvent.click(screen.getByRole('button', { name: 'Solve' }))
    expect(screen.getByText('Unable to solve equation')).toBeInTheDocument()
  })

  it('reports an error for an invalid calculus expression', () => {
    render(<AdvancedSection />)
    fireEvent.change(screen.getByDisplayValue('x^3 + 2*x'), { target: { value: '@@@' } })
    fireEvent.click(screen.getByRole('button', { name: 'Differentiate' }))
    expect(screen.getByText('Unable to calculate')).toBeInTheDocument()
  })

  it('handles a different variable', () => {
    render(<AdvancedSection />)
    fireEvent.change(screen.getByDisplayValue('x^2 - 5*x + 6'), { target: { value: 't^2 - 4' } })
    fireEvent.change(screen.getByDisplayValue('x'), { target: { value: 't' } })
    fireEvent.click(screen.getByRole('button', { name: 'Solve' }))
    expect(screen.getByText('Solutions: [2,-2]')).toBeInTheDocument()
  })
})