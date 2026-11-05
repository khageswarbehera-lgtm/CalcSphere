import { useMemo, useState } from 'react'
import { Card } from './UI'
import { formulaCategories, physicsFormulas, searchFormulas } from '../calc'

export interface FormulaLibrarySectionProps {
  onNavigate?: (section: string) => void
}

export function FormulaLibrarySection({ onNavigate }: FormulaLibrarySectionProps = {}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')

  const results = useMemo(() => searchFormulas(query, category as any), [query, category])

  return (
    <div className="grid math-grid">
      <Card title="Physics Formula Library">
        <label htmlFor="formula-search">Search formulas</label>
        <input
          id="formula-search"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, formula, unit, assumption..."
          aria-label="Search physics formulas"
        />
        <div role="tablist" aria-label="Formula categories">
          {formulaCategories.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={category === cat.id}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <p role="status" aria-live="polite">{results.length} formula(s) found.</p>
{results.length === 0 && <p className="empty-state" role="status">No formulas match your search or category.</p>}
      </Card>

      {results.map(entry => (
        <Card key={entry.id} title={entry.title}>
          <p><strong>Formula:</strong> {entry.formula}</p>
          <p><strong>Result unit:</strong> {entry.resultUnit}</p>
          <h3>Variables</h3>
          <ul>
            {entry.variables.map(v => (
              <li key={v.symbol}>{v.symbol}: {v.description} ({v.unit})</li>
            ))}
          </ul>
          <h3>Assumptions</h3>
          <ul>
            {entry.assumptions.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
          <p><strong>Worked example:</strong> {entry.example.given} → {entry.example.result}</p>
          <p><strong>Reference:</strong> {entry.reference}</p>
          <div className="action-buttons">
            <button
              onClick={() => onNavigate?.(entry.calculator.section)}
              aria-label={`Open ${entry.calculator.label} calculator`}
            >
              {entry.calculator.label} calculator
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export const PhysicsFormulaLibrarySection = FormulaLibrarySection
