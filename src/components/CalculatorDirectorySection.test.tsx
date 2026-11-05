import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CalculatorDirectorySection } from './CalculatorDirectorySection'

describe('CalculatorDirectorySection', () => {
  it('searches and shows empty state', () => {
    render(<CalculatorDirectorySection />)
    fireEvent.change(screen.getByLabelText('Search calculator directory'), { target: { value: 'zzzz-no-match' } })
    expect(screen.getByText(/No calculators match/i)).toBeInTheDocument()
  })

  it('navigates to a calculator', () => {
    const onNavigate = vi.fn()
    render(<CalculatorDirectorySection onNavigate={onNavigate} />)
    fireEvent.click(screen.getAllByRole('button', { name: /^Open /i })[0])
    expect(onNavigate).toHaveBeenCalled()
  })
})
