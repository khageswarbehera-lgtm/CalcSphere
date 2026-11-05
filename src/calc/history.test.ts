import { describe, expect, it } from 'vitest'

import {
  MAX_HISTORY_SIZE,
  addHistoryRecord,
  clearHistory,
  createHistoryRecord,
  getFavorites,
  loadHistory,
  removeHistoryRecord,
  removeHistoryStorage,
  saveHistory,
  searchHistory,
  toggleFavorite,
} from './history'

describe('calculation history', () => {
  it('creates records', () => {
    const record = createHistoryRecord({ calculator: 'Arithmetic', expression: '2+2', result: '4', units: 'none' })
    expect(record.calculator).toBe('Arithmetic')
    expect(record.result).toBe('4')
    expect(record.favorite).toBe(false)
  })

  it('saves and loads history', () => {
    const storage = new Map<string, string>()
    const mockStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value) },
      removeItem: (key: string) => { storage.delete(key) },
    }
    const record = createHistoryRecord({ calculator: 'Arithmetic', result: '4' })
    const state = addHistoryRecord({ version: 1, records: [] }, record)
    expect(saveHistory(state, mockStorage)).toBe(true)
    const loaded = loadHistory(mockStorage)
    expect(loaded.records).toHaveLength(1)
    expect(loaded.records[0].result).toBe('4')
  })

  it('deletes records', () => {
    const record = createHistoryRecord({ calculator: 'Arithmetic', result: '4' })
    const state = addHistoryRecord({ version: 1, records: [] }, record)
    const next = removeHistoryRecord(state, record.id)
    expect(next.records).toHaveLength(0)
  })

  it('clears history', () => {
    const record = createHistoryRecord({ calculator: 'Arithmetic', result: '4' })
    const state = addHistoryRecord({ version: 1, records: [] }, record)
    const cleared = clearHistory()
    expect(cleared.records).toHaveLength(0)
    expect(state.records).toHaveLength(1)
  })

  it('toggles favorites', () => {
    const record = createHistoryRecord({ calculator: 'Arithmetic', result: '4' })
    const state = addHistoryRecord({ version: 1, records: [] }, record)
    const favorited = toggleFavorite(state, record.id)
    expect(getFavorites(favorited)).toHaveLength(1)
    const unfavorited = toggleFavorite(favorited, record.id)
    expect(getFavorites(unfavorited)).toHaveLength(0)
  })

  it('handles corrupted storage', () => {
    const mockStorage = {
      getItem: () => '{bad json',
      setItem: () => {},
      removeItem: () => {},
    }
    expect(loadHistory(mockStorage).records).toHaveLength(0)
  })

  it('handles unavailable storage', () => {
    expect(loadHistory(null).records).toHaveLength(0)
    expect(saveHistory({ version: 1, records: [] }, null)).toBe(false)
  })

  it('limits history size', () => {
    let state = { version: 1, records: [] as any }
    for (let i = 0; i < MAX_HISTORY_SIZE + 5; i++) {
      state = addHistoryRecord(state, createHistoryRecord({ calculator: 'Arithmetic', result: String(i) }))
    }
    expect(state.records).toHaveLength(MAX_HISTORY_SIZE)
  })

  it('searches history', () => {
    const record = createHistoryRecord({ calculator: 'Finance', expression: 'EMI', result: '100' })
    const state = addHistoryRecord({ version: 1, records: [] }, record)
    expect(searchHistory(state, 'finance')).toHaveLength(1)
    expect(searchHistory(state, 'missing')).toHaveLength(0)
  })

  it('removes storage', () => {
    const storage = new Map<string, string>()
    const mockStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value) },
      removeItem: (key: string) => { storage.delete(key) },
    }
    storage.set('calcspace:calculation-history', '{}')
    removeHistoryStorage(mockStorage)
    expect(storage.has('calcspace:calculation-history')).toBe(false)
  })
})
