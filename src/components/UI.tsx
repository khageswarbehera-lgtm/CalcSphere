import { useMemo, useState, type ReactNode } from 'react'

export function Card({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="card">
      <h2>{title}</h2>
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
  return (
    <div className="input-group">
      <label>{label}</label>
      <div className="number-input-wrapper">
        <input
          type="number"
          placeholder="0"
          value={value === 0 ? '' : value}
          onChange={event => onChange(parseFloat(event.target.value) || 0)}
        />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
      <div className="input-feedback">Active value: {value}</div>
    </div>
  )
}

export const moneyFormat = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
