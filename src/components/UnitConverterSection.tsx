import { useMemo, useState } from 'react'
import { Card } from './UI'
import { convertUnit, formatUnitValue, unitsByCategory, unitIds } from '../calc'

const categories = ['length', 'area', 'volume', 'mass', 'temperature', 'time', 'speed', 'acceleration', 'force', 'pressure', 'energy', 'power', 'frequency', 'electrical']

export function UnitConverterSection() {
  const [category, setCategory] = useState('length')
  const [value, setValue] = useState(1)
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('ft')
  const [precision, setPrecision] = useState(6)

  const units = unitsByCategory(category)
  const result = useMemo(() => {
    try {
      return convertUnit(value, fromUnit, toUnit)
    } catch (e: any) {
      return null
    }
  }, [value, fromUnit, toUnit])

  const error = result === null ? 'Invalid or incompatible units' : ''

  return (
    <div className="grid math-grid">
      <Card title="Unit converter">
        <label htmlFor="unit-category">Category</label>
        <select id="unit-category" value={category} onChange={e => {
          setCategory(e.target.value)
          const first = unitsByCategory(e.target.value)[0]?.id
          if (first) setFromUnit(first)
          const second = unitsByCategory(e.target.value)[1]?.id ?? first
          if (second) setToUnit(second)
        }}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label htmlFor="unit-value">Value</label>
        <input id="unit-value" type="number" value={value} onChange={e => setValue(Number(e.target.value))} />

        <label htmlFor="from-unit">From</label>
        <select id="from-unit" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
          {units.map(u => <option key={u.id} value={u.id}>{u.id} - {u.name}</option>)}
        </select>

        <label htmlFor="to-unit">To</label>
        <select id="to-unit" value={toUnit} onChange={e => setToUnit(e.target.value)}>
          {units.map(u => <option key={u.id} value={u.id}>{u.id} - {u.name}</option>)}
        </select>

        <label htmlFor="precision">Precision</label>
        <input id="precision" type="number" value={precision} onChange={e => setPrecision(Number(e.target.value))} />

        {error && <p role="alert">{error}</p>}
        {!error && (
          <>
            <p>Source: {value} {fromUnit}</p>
            <p>Target: {formatUnitValue(result as number, precision)} {toUnit}</p>
            <p>Converted value: {formatUnitValue(result as number, precision)}</p>
          </>
        )}
        <p>Currency conversion is intentionally excluded because exchange rates change over time.</p>
      </Card>
    </div>
  )
}
