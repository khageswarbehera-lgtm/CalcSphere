import { describe, expect, it } from 'vitest'

import { formulaCategories, formulasByCategory, getFormulaById, physicsFormulas, searchFormulas } from './formulaLibrary'

const validSections = new Set(['home', 'arithmetic', 'scientific', 'advanced', 'physics', 'finance', 'everyday', 'matrix', 'numerical', 'statistics', 'electricity', 'waves', 'formulas'])

describe('formula library data', () => {
  it('has formulas', () => {
    expect(physicsFormulas.length).toBeGreaterThan(0)
  })

  it('has unique ids', () => {
    const ids = physicsFormulas.map(f => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('covers all categories', () => {
    const categories = new Set(physicsFormulas.map(f => f.category))
    for (const cat of ['mechanics', 'electricity', 'waves', 'optics', 'thermodynamics', 'fluids']) {
      expect(categories.has(cat as any)).toBe(true)
    }
  })

  it('has required fields', () => {
    for (const entry of physicsFormulas) {
      expect(entry.id).toBeTruthy()
      expect(entry.title).toBeTruthy()
      expect(entry.formula).toBeTruthy()
      expect(entry.variables.length).toBeGreaterThan(0)
      expect(entry.assumptions.length).toBeGreaterThan(0)
      expect(entry.example.given).toBeTruthy()
      expect(entry.example.result).toBeTruthy()
      expect(entry.reference).toBeTruthy()
    }
  })

  it('calculator links are valid', () => {
    for (const entry of physicsFormulas) {
      expect(entry.calculator.label).toBeTruthy()
      expect(validSections.has(entry.calculator.section)).toBe(true)
    }
  })

  it('search works', () => {
    const results = searchFormulas('force')
    expect(results.length).toBeGreaterThan(0)
    expect(searchFormulas('nonexistenttermxyz').length).toBe(0)
  })

  it('category filter works', () => {
    const mechanics = formulasByCategory('mechanics')
    expect(mechanics.length).toBeGreaterThan(0)
    expect(mechanics.every(f => f.category === 'mechanics')).toBe(true)
    const filtered = searchFormulas('', 'electricity')
    expect(filtered.every(f => f.category === 'electricity')).toBe(true)
  })

  it('getFormulaById works', () => {
    const entry = getFormulaById('mechanics-newton-second-law')
    expect(entry).toBeDefined()
    expect(entry?.title).toContain('Newton')
  })

  it('formula categories include all', () => {
    expect(formulaCategories.map(c => c.id)).toContain('all')
  })
})
