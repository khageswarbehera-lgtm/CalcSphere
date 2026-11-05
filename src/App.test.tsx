import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the CalcSphere welcome screen', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Welcome to CalcSphere/i })).toBeInTheDocument()
  })

  it('opens the navigation menu and closes it after selecting a category', () => {
    render(<App />)
    const menuButton = screen.getByRole('button', { name: 'Menu' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(menuButton)
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Arithmetic' }))
    expect(screen.getByRole('button', { name: 'Arithmetic' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
  })
})
