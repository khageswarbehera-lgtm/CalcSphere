import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EverydayMathSection } from './EverydayMathSection'

describe('EverydayMathSection', () => {
  it('renders the section', () => {
    render(<EverydayMathSection />)
    expect(screen.getByText('Percentage of a number')).toBeInTheDocument()
  })
})