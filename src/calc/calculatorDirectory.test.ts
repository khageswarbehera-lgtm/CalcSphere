import { describe, expect, it } from 'vitest'

import {
  calculatorCategories,
  calculatorDirectory,
  calculatorsByCategory,
  getCalculator,
  implementedCalculators,
  searchCalculators,
} from './calculatorDirectory'

const validSections = new Set([
  'arithmetic', 'scientific', 'advanced', 'physics', 'finance', 'everyday', 'matrix',
  'numerical', 'statistics', 'electricity', 'waves', 'formulas', 'utilities', 'units',
  'history', 'directory',
])

describe('calculator directory', () => {
  it('has entries', () => {
    expect(calculatorDirectory.length).toBeGreaterThan(0)
  })

  it('has unique ids', () => {
    const ids = calculatorDirectory.map(entry => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses valid categories', () => {
    for (const entry of calculatorDirectory) {
      expect(calculatorCategories).toContain(entry.category)
    }
  })

  it('verifies implemented links', () => {
    for (const entry of implementedCalculators()) {
      expect(validSections.has(entry.section)).toBe(true)
    }
  })

  it('hides unimplemented calculators', () => {
    const all = calculatorDirectory.length
    const visible = implementedCalculators().length
    expect(visible).toBeLessThanOrEqual(all)
    expect(implementedCalculators().every(entry => entry.implemented)).toBe(true)
  })

  it('searches by name and description', () => {
    expect(searchCalculators('matrix').length).toBeGreaterThan(0)
    expect(searchCalculators('definitely-not-a-calculator').length).toBe(0)
  })

  it('filters by category', () => {
    const physics = calculatorsByCategory('Physics')
    expect(physics.length).toBeGreaterThan(0)
    expect(physics.every(entry => entry.category === 'Physics')).toBe(true)
    const filtered = searchCalculators('', 'Statistics')
    expect(filtered.every(entry => entry.category === 'Statistics')).toBe(true)
  })

  it('gets calculator by id', () => {
    expect(getCalculator('arithmetic')?.name).toContain('Arithmetic')
  })
})
