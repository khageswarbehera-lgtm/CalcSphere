import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the CalcSpace welcome screen', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Welcome to CalcSpace/i })).toBeInTheDocument()
  })
})