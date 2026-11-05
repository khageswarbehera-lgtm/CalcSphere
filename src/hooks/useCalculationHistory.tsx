import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  HistoryRecord,
  HistoryRecordInput,
  HistoryState,
  addHistoryRecord,
  clearHistory,
  getFavorites,
  loadHistory,
  removeHistoryRecord,
  saveHistory,
  searchHistory,
  toggleFavorite,
} from '../calc/history'

interface HistoryContextValue {
  state: HistoryState
  records: HistoryRecord[]
  favorites: HistoryRecord[]
  addRecord: (record: HistoryRecord | HistoryRecordInput) => void
  removeRecord: (id: string) => void
  clearAll: () => void
  toggleFavoriteById: (id: string) => void
  search: (query: string) => HistoryRecord[]
}

const HistoryContext = createContext<HistoryContextValue | null>(null)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HistoryState>(() => loadHistory())

  useEffect(() => {
    saveHistory(state)
  }, [state])

  const addRecord = useCallback((record: HistoryRecord | HistoryRecordInput) => {
    setState(current => addHistoryRecord(current, record))
  }, [])

  const removeRecord = useCallback((id: string) => {
    setState(current => removeHistoryRecord(current, id))
  }, [])

  const clearAll = useCallback(() => {
    setState(clearHistory())
  }, [])

  const toggleFavoriteById = useCallback((id: string) => {
    setState(current => toggleFavorite(current, id))
  }, [])

  const search = useCallback((query: string) => searchHistory(state, query), [state])

  const value = useMemo<HistoryContextValue>(() => ({
    state,
    records: state.records,
    favorites: getFavorites(state),
    addRecord,
    removeRecord,
    clearAll,
    toggleFavoriteById,
    search,
  }), [state, addRecord, removeRecord, clearAll, toggleFavoriteById, search])

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useCalculationHistory(): HistoryContextValue | null {
  return useContext(HistoryContext)
}
