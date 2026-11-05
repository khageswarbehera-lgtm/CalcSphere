import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ScientificSection } from './ScientificSection'

describe('ScientificSection', () => {
  it('renders the section', () => {
    render(<ScientificSection />)
    expect(screen.getByText('Scientific')).toBeInTheDocument()
    expect(screen.getByText(/Angle mode:/)).toBeInTheDocument()
  })
})