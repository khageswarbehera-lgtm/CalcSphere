import { lazy, Suspense, useState } from 'react'

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

  const navItems: { id: Section; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'arithmetic', label: 'Arithmetic' },
    { id: 'scientific', label: 'Scientific' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'physics', label: 'Physics' },
    { id: 'finance', label: 'Finance' },
    { id: 'everyday', label: 'Everyday Math' },
    { id: 'matrix', label: 'Matrix & Vector' },
{ id: 'numerical', label: 'Numerical Math' },
{ id: 'statistics', label: 'Statistics & Probability' },
{ id: 'electricity', label: 'Electricity & Circuits' },
{ id: 'waves', label: 'Waves, Optics, Heat & Fluids' },
{ id: 'formulas', label: 'Formula Library' },
{ id: 'utilities', label: 'Financial Utilities' },
{ id: 'units', label: 'Unit Converter' },
{ id: 'history', label: 'History & Favorites' },
{ id: 'directory', label: 'Calculator Directory' },
{ id: 'graphing', label: 'Function Graphing' },
  ]

  return (
<main id="main-content">
        <a href="#main-content" className="skip-link">Skip to main content</a>
      <header>
        <div>
          <p className="eyebrow">EVERYDAY CALCULATIONS</p>
          <h1>
            Calc<span>Space</span>
          </h1>
        </div>

        <nav aria-label="Primary">
          {navItems.map(item => (
<button
              key={item.id}
              className={section === item.id ? 'active' : ''}
              aria-current={section === item.id ? 'page' : undefined}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        {section === 'home' && (
          <div className="intro">
            <h2>Welcome to CalcSpace</h2>
            <p>Select a category from the navigation to begin.</p>
            <div className="dashboard-grid">
              {navItems.filter(item => item.id !== 'home').map(item => (
                <button key={item.id} className="category-card" onClick={() => setSection(item.id)}>
                  <strong>{item.label}</strong>
                  <span>Open calculator</span>
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
        Results are estimates; verify financial decisions with your lender.
      </footer>
    </main>
  )
}