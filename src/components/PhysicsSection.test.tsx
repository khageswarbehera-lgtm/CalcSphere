import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PhysicsSection } from './PhysicsSection'

describe('PhysicsSection', () => {
  it('computes force, kinetic energy and displacement for the default inputs', () => {
    render(<PhysicsSection />)
    expect(screen.getByText('Force: 98 N')).toBeInTheDocument()
    expect(screen.getByText('Kinetic Energy: 2000 J')).toBeInTheDocument()
    expect(screen.getByText('Displacement: 100 m')).toBeInTheDocument()
  })

  it('handles zero values', () => {
    render(<PhysicsSection />)
    fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '0' } })
    fireEvent.change(screen.getByDisplayValue('20'), { target: { value: '0' } })
    expect(screen.getByText('Force: 0 N')).toBeInTheDocument()
    expect(screen.getByText('Kinetic Energy: 0 J')).toBeInTheDocument()
    expect(screen.getByText('Displacement: 0 m')).toBeInTheDocument()
  })

  it('handles decimal values', () => {
    render(<PhysicsSection />)
    fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '2.5' } })
    fireEvent.change(screen.getByDisplayValue('9.8'), { target: { value: '4' } })
    fireEvent.change(screen.getByDisplayValue('20'), { target: { value: '3.5' } })
    fireEvent.change(screen.getByDisplayValue('5'), { target: { value: '2' } })
    expect(screen.getByText('Force: 10 N')).toBeInTheDocument()
    expect(screen.getByText('Kinetic Energy: 15.3125 J')).toBeInTheDocument()
    expect(screen.getByText('Displacement: 7 m')).toBeInTheDocument()
  })

  it('handles negative values', () => {
    render(<PhysicsSection />)
    fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '-5' } })
    expect(screen.getByText('Force: -49 N')).toBeInTheDocument()
  })
})