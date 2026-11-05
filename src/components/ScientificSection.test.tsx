import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ScientificSection } from './ScientificSection'

describe('ScientificSection', () => {
  it('renders the section', () => {
    render(<ScientificSection />)
    expect(screen.getByText('Scientific')).toBeInTheDocument()
    expect(screen.getByText(/Angle mode:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'AC' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Backspace' })).toBeInTheDocument()
  })

  it('shows exact and decimal special-angle results in degrees', () => {
    render(<ScientificSection />)
    const input = screen.getByLabelText('Scientific expression') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'sin(30)' } })
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByText('1/2')).toBeInTheDocument()
    expect(screen.getByText('0.5')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'sin(60)' } })
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByText('√3/2')).toBeInTheDocument()
    expect(screen.getByText('0.8660254')).toBeInTheDocument()
  })

  it('respects radians and recognizes exact square roots', () => {
    render(<ScientificSection />)
    const input = screen.getByLabelText('Scientific expression') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'sin(30)' } })
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Radians' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.queryByText('1/2')).not.toBeInTheDocument()
    expect(screen.getByText('-0.98803162')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'sqrt(2)' } })
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByText('√2')).toBeInTheDocument()
    expect(screen.getByText('1.41421356')).toBeInTheDocument()
  })

  it('inserts a scientific function at the selected cursor position', () => {
    render(<ScientificSection />)
    const input = screen.getByLabelText('Scientific expression') as HTMLInputElement
    fireEvent.change(input, { target: { value: '2+3' } })
    input.setSelectionRange(2, 3)
    fireEvent.click(screen.getByRole('button', { name: 'sin(' }))
    expect(input).toHaveValue('2+sin(')
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: ')' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByText('2.05233596')).toBeInTheDocument()
  })

  it('supports keyboard evaluation, clearing, and clipboard copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<ScientificSection />)
    const input = screen.getByLabelText('Scientific expression') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'sqrt(9)' } })
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(document.querySelector('.calculator-exact-result output')?.textContent).toBe('3')
    fireEvent.click(screen.getByRole('button', { name: 'Copy result' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('3'))

    fireEvent.keyDown(window, { key: 'Backspace' })
    expect(input).toHaveValue('sqrt(9')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(input).toHaveValue('')
  })
})