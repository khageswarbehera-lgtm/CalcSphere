import { CalculationError } from './errors'

export const HISTORY_STORAGE_KEY = 'calcspace:calculation-history'
export const HISTORY_VERSION = 1
export const MAX_HISTORY_SIZE = 50

export interface HistoryRecordInput {
  calculator: string
  expression?: string
  inputs?: Record<string, unknown>
  result: string
  units?: string
  timestamp?: string
  favorite?: boolean
}

export interface HistoryRecord {
  id: string
  calculator: string
  expression?: string
  inputs?: Record<string, unknown>
  result: string
  units?: string
  timestamp: string
  favorite: boolean
}

export interface HistoryState {
  version: number
  records: HistoryRecord[]
}

export interface HistoryStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const SENSITIVE_KEY_PATTERN = /password|token|secret|api[_-]?key|credential/i

function safeStorage(storage?: HistoryStorage | null): HistoryStorage | null {
  if (storage === null) return null
  if (storage) return storage
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

function createId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    // Fall through to the timestamp-based identifier.
  }
  return `history-${Date.now()}-${Math.random().toString(36).slice(2)}`
}
function sanitizeInputs(inputs?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)) return undefined
  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(inputs)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) continue
    sanitized[key] = value
  }
  return Object.keys(sanitized).length > 0 ? sanitized : undefined
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

export function isHistoryRecord(value: unknown): value is HistoryRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    record.id.length > 0 &&
    typeof record.calculator === 'string' &&
    record.calculator.length > 0 &&
    typeof record.result === 'string' &&
    isValidTimestamp(record.timestamp) &&
    typeof record.favorite === 'boolean' &&
    (record.expression === undefined || typeof record.expression === 'string') &&
    (record.units === undefined || typeof record.units === 'string') &&
    (record.inputs === undefined || (typeof record.inputs === 'object' && record.inputs !== null && !Array.isArray(record.inputs)))
  )
}

export function validateHistoryState(value: unknown): HistoryState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { version: HISTORY_VERSION, records: [] }
  }
  const state = value as Record<string, unknown>
  const records = Array.isArray(state.records) ? state.records.filter(isHistoryRecord) : []
  return {
    version: HISTORY_VERSION,
    records: records.slice(0, MAX_HISTORY_SIZE),
  }
}

export function createHistoryRecord(input: HistoryRecordInput): HistoryRecord {
  if (!input || typeof input !== 'object') {
    throw new CalculationError('INVALID_INPUT', 'History record input is required')
  }
  if (typeof input.calculator !== 'string' || !input.calculator.trim()) {
    throw new CalculationError('INVALID_INPUT', 'Calculator name is required')
  }
  if (typeof input.result !== 'string') {
    throw new CalculationError('INVALID_INPUT', 'Result is required')
  }
  return {
    id: createId(),
    calculator: input.calculator.trim(),
    expression: typeof input.expression === 'string' ? input.expression : undefined,
    inputs: sanitizeInputs(input.inputs),
    result: input.result,
    units: typeof input.units === 'string' ? input.units : undefined,
    timestamp: input.timestamp && isValidTimestamp(input.timestamp) ? input.timestamp : new Date().toISOString(),
    favorite: input.favorite === true,
  }
}

export function loadHistory(storage?: HistoryStorage | null): HistoryState {
  const target = safeStorage(storage)
  if (!target) return { version: HISTORY_VERSION, records: [] }
  try {
    const raw = target.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return { version: HISTORY_VERSION, records: [] }
    return validateHistoryState(JSON.parse(raw))
  } catch {
    return { version: HISTORY_VERSION, records: [] }
  }
}

export function saveHistory(state: HistoryState, storage?: HistoryStorage | null, limit = MAX_HISTORY_SIZE): boolean {
  const target = safeStorage(storage)
  if (!target) return false
  try {
    const validated = validateHistoryState(state)
    const trimmed: HistoryState = {
      version: HISTORY_VERSION,
      records: validated.records.slice(0, limit),
    }
    target.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed))
    return true
  } catch {
    return false
  }
}

export function addHistoryRecord(state: HistoryState, record: HistoryRecord | HistoryRecordInput, limit = MAX_HISTORY_SIZE): HistoryState {
  const normalized = isHistoryRecord(record) ? record : createHistoryRecord(record as HistoryRecordInput)
  const records = [normalized, ...state.records.filter(item => item.id !== normalized.id)]
  return validateHistoryState({ version: HISTORY_VERSION, records: records.slice(0, limit) })
}

export function removeHistoryRecord(state: HistoryState, id: string): HistoryState {
  return {
    version: HISTORY_VERSION,
    records: state.records.filter(record => record.id !== id),
  }
}

export function clearHistory(): HistoryState {
  return { version: HISTORY_VERSION, records: [] }
}

export function toggleFavorite(state: HistoryState, id: string): HistoryState {
  return {
    version: HISTORY_VERSION,
    records: state.records.map(record =>
      record.id === id ? { ...record, favorite: !record.favorite } : record,
    ),
  }
}

export function getFavorites(state: HistoryState): HistoryRecord[] {
  return state.records.filter(record => record.favorite)
}

export function searchHistory(state: HistoryState, query: string): HistoryRecord[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return state.records
  return state.records.filter(record => {
    const haystack = [record.calculator, record.expression, record.result, record.units]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

export function removeHistoryStorage(storage?: HistoryStorage | null): void {
  const target = safeStorage(storage)
  try {
    target?.removeItem(HISTORY_STORAGE_KEY)
  } catch {
    // Ignore unavailable or corrupt storage.
  }
}

