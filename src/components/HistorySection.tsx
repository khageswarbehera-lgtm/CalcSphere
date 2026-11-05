import { useState } from 'react'
import { Card } from './UI'
import { useCalculationHistory } from '../hooks/useCalculationHistory'

export function HistorySection() {
  const history = useCalculationHistory()
  const records = history?.records ?? []
  const favorites = history?.favorites ?? []
  const removeRecord = history?.removeRecord ?? (() => {})
  const clearAll = history?.clearAll ?? (() => {})
  const toggleFavoriteById = history?.toggleFavoriteById ?? (() => {})
  const searchFn = history?.search ?? (() => records)
  const [query, setQuery] = useState('')
  const [showFavorites, setShowFavorites] = useState(false)
  const displayed = showFavorites ? favorites : (query ? searchFn(query) : records)

  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value) } catch { /* ignore */ }
  }

  return (
    <div className="grid math-grid">
      <Card title="Calculation history and favorites">
        <label htmlFor="history-search">Search history</label>
        <input id="history-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search calculator, expression or result" />
        <div className="action-buttons">
          <button onClick={() => setShowFavorites(false)}>All history</button>
          <button onClick={() => setShowFavorites(true)}>Favorites</button>
          <button onClick={clearAll}>Clear history</button>
        </div>
        {displayed.length === 0 && <p>No saved calculations yet.</p>}
        <ul>
          {displayed.map(record => (
            <li key={record.id}>
              <p><strong>{record.calculator}</strong> — {record.timestamp}</p>
              {record.expression && <p>Expression/inputs: {record.expression}</p>}
              {record.inputs && <p>Inputs: {JSON.stringify(record.inputs)}</p>}
              <p>Result: {record.result} {record.units ?? ''}</p>
              <div className="action-buttons">
                <button onClick={() => copy(record.result)}>Copy result</button>
                <button onClick={() => toggleFavoriteById(record.id)}>{record.favorite ? 'Unfavorite' : 'Favorite'}</button>
                <button onClick={() => removeRecord(record.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <p>Stored locally in this browser. Sensitive values are not saved.</p>
      </Card>
    </div>
  )
}
