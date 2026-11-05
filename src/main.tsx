import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { HistoryProvider } from './hooks/useCalculationHistory'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><HistoryProvider><App /></HistoryProvider></StrictMode>,
)
