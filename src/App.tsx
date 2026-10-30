import { lazy, Suspense, useState } from 'react'

const ArithmeticSection = lazy(() => import('./components/ArithmeticSection').then(m => ({ default: m.ArithmeticSection })))
const AdvancedSection = lazy(() => import('./components/AdvancedSection').then(m => ({ default: m.AdvancedSection })))
const PhysicsSection = lazy(() => import('./components/PhysicsSection').then(m => ({ default: m.PhysicsSection })))
const FinanceSection = lazy(() => import('./components/FinanceSection').then(m => ({ default: m.FinanceSection })))

type Section = 'home' | 'arithmetic' | 'advanced' | 'physics' | 'finance'

export default function App() {
  const [section, setSection] = useState<Section>('home')

  const navItems: { id: Section; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'arithmetic', label: 'Arithmetic' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'physics', label: 'Physics' },
    { id: 'finance', label: 'Finance' },
  ]

  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">EVERYDAY CALCULATIONS</p>
          <h1>
            Calc<span>Space</span>
          </h1>
        </div>

        <nav>
          {navItems.map(item => (
            <button
              key={item.id}
              className={section === item.id ? 'active' : ''}
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
          </div>
        )}
        {section === 'arithmetic' && <ArithmeticSection />}
        {section === 'advanced' && <AdvancedSection />}
        {section === 'physics' && <PhysicsSection />}
        {section === 'finance' && <FinanceSection />}
      </Suspense>

      <footer>
        Results are estimates; verify financial decisions with your lender.
      </footer>
    </main>
  )
}