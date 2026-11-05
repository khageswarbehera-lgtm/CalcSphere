import { useMemo, useState } from 'react'
import { Card } from './UI'
import { calculatorCategories, searchCalculators } from '../calc'

export interface CalculatorDirectorySectionProps {
  onNavigate?: (section: string) => void
}

export function CalculatorDirectorySection({ onNavigate }: CalculatorDirectorySectionProps = {}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')

  const results = useMemo(() => searchCalculators(query, category as any), [query, category])

  return (
    <div className="grid math-grid">
      <Card title="Calculator directory">
        <label htmlFor="calculator-search">Search calculators</label>
        <input
          id="calculator-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search by name, category or description"
          aria-label="Search calculator directory"
        />
        <label htmlFor="calculator-category">Category</label>
        <select
          id="calculator-category"
          value={category}
          onChange={event => setCategory(event.target.value)}
          aria-label="Filter calculators by category"
        >
          <option value="All">All categories</option>
          {calculatorCategories.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <p role="status">{results.length} calculator{results.length === 1 ? '' : 's'} found.</p>
        {results.length === 0 && (
          <p role="status">No calculators match your search. Try another term or category.</p>
        )}
      </Card>

      {results.map(entry => (
        <Card key={entry.id} title={entry.name}>
          <p>{entry.description}</p>
          <p><strong>Category:</strong> {entry.category}</p>
          <button
            type="button"
            onClick={() => onNavigate?.(entry.section)}
            aria-label={`Open ${entry.name}`}
          >
            Open calculator
          </button>
        </Card>
      ))}
    </div>
  )
}

export const CalculatorDirectory = CalculatorDirectorySection
export const DirectorySection = CalculatorDirectorySection
