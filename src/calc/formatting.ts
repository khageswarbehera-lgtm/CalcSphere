export function moneyFormat(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions & { locale?: string }): string {
  const { locale = 'en-IN', ...rest } = options ?? {}
  return new Intl.NumberFormat(locale, rest).format(value)
}

export function formatCompact(value: number, locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}