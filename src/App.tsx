import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const ArithmeticSection = lazy(() => import('./components/ArithmeticSection').then(m => ({ default: m.ArithmeticSection })))
const AdvancedSection = lazy(() => import('./components/AdvancedSection').then(m => ({ default: m.AdvancedSection })))
const PhysicsSection = lazy(() => import('./components/PhysicsSection').then(m => ({ default: m.PhysicsSection })))
const MatrixVectorSection = lazy(() => import('./components/MatrixVectorSection').then(m => ({ default: m.MatrixVectorSection })))
const ScientificSection = lazy(() => import('./components/ScientificSection').then(m => ({ default: m.ScientificSection })))
const FinanceSection = lazy(() => import('./components/FinanceSection').then(m => ({ default: m.FinanceSection })))
const EverydayMathSection = lazy(() => import('./components/EverydayMathSection').then(m => ({ default: m.EverydayMathSection })))
const NumericalMathematicsSection = lazy(() => import('./components/NumericalMathematicsSection').then(m => ({ default: m.NumericalMathematicsSection })))
const StatisticsProbabilitySection = lazy(() => import('./components/StatisticsProbabilitySection').then(m => ({ default: m.StatisticsProbabilitySection })))
const ElectricityCircuitsSection = lazy(() => import('./components/ElectricityCircuitsSection').then(m => ({ default: m.ElectricityCircuitsSection })))
const WavesOpticsThermodynamicsFluidsSection = lazy(() => import('./components/WavesOpticsThermodynamicsFluidsSection').then(m => ({ default: m.WavesOpticsThermodynamicsFluidsSection })))
const FormulaLibrarySection = lazy(() => import('./components/FormulaLibrarySection').then(m => ({ default: m.FormulaLibrarySection })))
const FinancialUtilitiesSection = lazy(() => import('./components/FinancialUtilitiesSection').then(m => ({ default: m.FinancialUtilitiesSection })))
const UnitConverterSection = lazy(() => import('./components/UnitConverterSection').then(m => ({ default: m.UnitConverterSection })))
const HistorySection = lazy(() => import('./components/HistorySection').then(m => ({ default: m.HistorySection })))
const FunctionGraphingSection = lazy(() => import('./components/FunctionGraphingSection').then(m => ({ default: m.FunctionGraphingSection })))
const CalculatorDirectorySection = lazy(() => import('./components/CalculatorDirectorySection').then(m => ({ default: m.CalculatorDirectorySection })))

type Section = 'home' | 'arithmetic' | 'scientific' | 'advanced' | 'physics' | 'finance' | 'everyday' | 'matrix' | 'numerical' | 'statistics' | 'electricity' | 'waves' | 'formulas' | 'utilities' | 'units' | 'history' | 'directory' | 'graphing'

export default function App() {
  const [section, setSection] = useState<Section>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  const navItems: { id: Section; label: string; icon: string; description: string }[] = [
    { id: 'home', label: 'Home', icon: '⌂', description: 'Your calculation workspace' },
    { id: 'arithmetic', label: 'Arithmetic', icon: '＋', description: 'Everyday expressions and quick answers' },
    { id: 'scientific', label: 'Scientific', icon: '∑', description: 'Functions, roots, logarithms, and more' },
    { id: 'advanced', label: 'Advanced', icon: 'ƒ', description: 'Equations, calculus, and complex numbers' },
    { id: 'physics', label: 'Physics', icon: '◉', description: 'Motion, energy, force, and mechanics' },
    { id: 'finance', label: 'Finance', icon: '₹', description: 'Loans, investments, interest, and GST' },
    { id: 'everyday', label: 'Everyday Math', icon: '%', description: 'Percentages, ratios, fractions, and averages' },
    { id: 'matrix', label: 'Matrix & Vector', icon: '▦', description: 'Matrices, vectors, and transformations' },
    { id: 'numerical', label: 'Numerical Math', icon: '≈', description: 'Limits, series, roots, and integration' },
    { id: 'statistics', label: 'Statistics & Probability', icon: '◌', description: 'Data analysis and probability tools' },
    { id: 'electricity', label: 'Electricity & Circuits', icon: 'ϟ', description: 'Power, resistance, and circuit laws' },
    { id: 'waves', label: 'Waves, Optics, Heat & Fluids', icon: '⌁', description: 'Applied science calculation tools' },
    { id: 'formulas', label: 'Formula Library', icon: '≡', description: 'Searchable science and maths formulas' },
    { id: 'utilities', label: 'Financial Utilities', icon: '▣', description: 'Tax, salary, and financial planning' },
    { id: 'units', label: 'Unit Converter', icon: '⇄', description: 'Convert common units with precision' },
    { id: 'history', label: 'History & Favorites', icon: '◷', description: 'Review and reuse past calculations' },
    { id: 'directory', label: 'Calculator Directory', icon: '▤', description: 'Browse every CalcSphere tool' },
    { id: 'graphing', label: 'Function Graphing', icon: '⌇', description: 'Visualize equations and functions' },
  ]
  const primaryItems = navItems.slice(0, 8)
  const secondaryItems = navItems.slice(8)
  const selectSection = (nextSection: Section) => {
    setSection(nextSection)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('mousedown', closeOnOutsideClick)
    }
  }, [menuOpen])

  const renderNavItems = (items: typeof navItems) => items.map(item => (
    <button
      key={item.id}
      className={section === item.id ? 'active' : ''}
      aria-current={section === item.id ? 'page' : undefined}
      onClick={() => selectSection(item.id)}
    >
      {item.label}
    </button>
  ))

  return (
    <main id="main-content">
        <a href="#main-content" className="skip-link">Skip to main content</a>
      <header ref={headerRef} className="application-header">
        <div className="header-brand-row">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">∑</div>
            <div>
              <p className="eyebrow">PRECISION CALCULATORS</p>
              <h1>Calc<span>Sphere</span></h1>
              <p className="brand-tagline">Calculate Everything. Understand Anything.</p>
            </div>
          </div>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen(open => !open)}
          >
            <span aria-hidden="true">☰</span>
            {menuOpen ? 'Close menu' : 'Menu'}
          </button>
        </div>
        <div className="header-nav-region">
          <nav id="site-navigation" className={`header-navigation${menuOpen ? ' menu-open' : ''}`} aria-label="Calculator navigation">
            <div className="nav-group nav-primary">
              <p>Core calculators</p>
              <div>{renderNavItems(primaryItems)}</div>
            </div>
            <div className="nav-group nav-secondary">
              <p>More tools</p>
              <div>{renderNavItems(secondaryItems)}</div>
            </div>
          </nav>
        </div>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        {section === 'home' && (
          <div className="intro">
            <div className="hero-copy">
              <p className="eyebrow">ONE PLATFORM, EVERY FORMULA</p>
              <h2>Welcome to CalcSphere</h2>
              <p>Choose a purpose-built calculator and get clear, reliable answers without leaving your workspace.</p>
            </div>
            <div className="dashboard-grid">
              {navItems.filter(item => item.id !== 'home').map(item => (
                <button key={item.id} className="category-card" onClick={() => selectSection(item.id)}>
                  <span className="category-icon" aria-hidden="true">{item.icon}</span>
                  <strong>{item.label}</strong>
                  <span className="category-description">{item.description}</span>
                  <span className="category-action">Open calculator <span aria-hidden="true">→</span></span>
                </button>
              ))}
            </div>
          </div>
        )}
        {section === 'arithmetic' && <ArithmeticSection />}
        {section === 'scientific' && <ScientificSection />}
        {section === 'advanced' && <AdvancedSection />}
        {section === 'physics' && <PhysicsSection />}
        {section === 'finance' && <FinanceSection />}
        {section === 'everyday' && <EverydayMathSection />}
        {section === 'matrix' && <MatrixVectorSection />}
{section === 'numerical' && <NumericalMathematicsSection />}
{section === 'statistics' && <StatisticsProbabilitySection />}
{section === 'electricity' && <ElectricityCircuitsSection />}
{section === 'waves' && <WavesOpticsThermodynamicsFluidsSection />}
{section === 'formulas' && <FormulaLibrarySection onNavigate={(s) => setSection(s as Section)} />}
{section === 'utilities' && <FinancialUtilitiesSection />}
{section === 'units' && <UnitConverterSection />}
{section === 'history' && <HistorySection />}
{section === 'directory' && <CalculatorDirectorySection onNavigate={(s) => setSection(s as Section)} />}
{section === 'graphing' && <FunctionGraphingSection />}
      </Suspense>

      <footer>
        <strong>CalcSphere</strong>
        <span>Professional calculators for everyday decisions.</span>
        <span>© {new Date().getFullYear()} CalcSphere. Results are estimates; verify financial decisions with your lender.</span>
      </footer>
    </main>
  )
}
