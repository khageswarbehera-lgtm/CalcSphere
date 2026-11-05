import { useId, type ReactNode } from 'react'

export function Card({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="card">
      <h2 className="card-title">{title}</h2>
      {children}
    </section>
  )
}

export function NumberInput({
  label,
  value,
  onChange,
  suffix = '',
}: {
  label: string
  value: number
  onChange: (value: number) => void
  suffix?: string
}) {
  const id = useId()
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <div className="number-input-wrapper">
        <input
          id={id}
          type="number"
          placeholder="0"
          value={value === 0 ? '' : value}
          onChange={event => onChange(parseFloat(event.target.value) || 0)}
          aria-label={label}
        />
        {suffix && <span className="suffix" aria-hidden="true">{suffix}</span>}
      </div>
      <div className="input-feedback" aria-live="polite">Active value: {value}</div>
    </div>
  )
}

export { moneyFormat } from '../calc/formatting'
