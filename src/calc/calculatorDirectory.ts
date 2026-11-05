export type CalculatorCategory =
  | 'Arithmetic'
  | 'Everyday Math'
  | 'Advanced Mathematics'
  | 'Physics'
  | 'Engineering'
  | 'Banking & Finance'
  | 'Statistics'
  | 'Unit Conversion'

export const calculatorCategories: CalculatorCategory[] = [
  'Arithmetic',
  'Everyday Math',
  'Advanced Mathematics',
  'Physics',
  'Engineering',
  'Banking & Finance',
  'Statistics',
  'Unit Conversion',
]

export interface CalculatorEntry {
  id: string
  name: string
  category: CalculatorCategory
  description: string
  section: string
  implemented: boolean
  keywords?: string[]
}

export const calculatorDirectory: CalculatorEntry[] = [
  {
    id: 'arithmetic',
    name: 'Arithmetic Calculator',
    category: 'Arithmetic',
    description: 'Evaluate arithmetic expressions using direct text input or the keypad.',
    section: 'arithmetic',
    implemented: true,
    keywords: ['basic', 'addition', 'subtraction', 'multiplication', 'division'],
  },
  {
    id: 'scientific',
    name: 'Scientific Calculator',
    category: 'Arithmetic',
    description: 'Scientific functions including trigonometry, logarithms, powers and roots.',
    section: 'scientific',
    implemented: true,
    keywords: ['trig', 'log', 'sin', 'cos', 'tan', 'scientific'],
  },
  {
    id: 'everyday-math',
    name: 'Everyday Math',
    category: 'Everyday Math',
    description: 'Percentages, ratios, proportions, primes and common everyday calculations.',
    section: 'everyday',
    implemented: true,
    keywords: ['percentage', 'ratio', 'proportion', 'prime'],
  },
  {
    id: 'advanced-math',
    name: 'Advanced Mathematics',
    category: 'Advanced Mathematics',
    description: 'Solve equations and calculate derivatives and integrals symbolically.',
    section: 'advanced',
    implemented: true,
    keywords: ['equation', 'derivative', 'integral', 'symbolic'],
  },
  {
    id: 'numerical-mathematics',
    name: 'Numerical Mathematics',
    category: 'Advanced Mathematics',
    description: 'Limits, summations, series, numerical root finding and numerical integration.',
    section: 'numerical',
    implemented: true,
    keywords: ['limit', 'series', 'bisection', 'newton', 'integration'],
  },
  {
    id: 'matrix-vector',
    name: 'Matrix & Vector',
    category: 'Advanced Mathematics',
    description: 'Matrix and vector operations, determinants, inverses and products.',
    section: 'matrix',
    implemented: true,
    keywords: ['matrix', 'vector', 'determinant', 'inverse'],
  },
  {
    id: 'formula-library',
    name: 'Physics Formula Library',
    category: 'Advanced Mathematics',
    description: 'Searchable physics formulas with variables, units, assumptions and examples.',
    section: 'formulas',
    implemented: true,
    keywords: ['formula', 'physics', 'reference'],
  },
  {
    id: 'mechanics',
    name: 'Mechanics',
    category: 'Physics',
    description: 'Motion, forces, momentum, work, energy, power, density, pressure and circular motion.',
    section: 'physics',
    implemented: true,
    keywords: ['force', 'energy', 'motion', 'mechanics'],
  },
  {
    id: 'waves-optics-thermodynamics-fluids',
    name: 'Waves, Optics, Heat & Fluids',
    category: 'Physics',
    description: 'Wave speed, optics, thermodynamics and fluid mechanics calculators.',
    section: 'waves',
    implemented: true,
    keywords: ['wave', 'optics', 'heat', 'fluid', 'thermodynamics'],
  },

  {
    id: 'electricity-circuits',
    name: 'Electricity & Circuits',
    category: 'Engineering',
    description: 'Ohm’s law, electrical power, circuits, capacitance, inductance and transformers.',
    section: 'electricity',
    implemented: true,
    keywords: ['ohm', 'circuit', 'voltage', 'current', 'resistance'],
  },
  {
    id: 'finance',
    name: 'Banking & Finance',
    category: 'Banking & Finance',
    description: 'EMI, fixed and recurring deposits, SIP growth, interest, GST and commerce helpers.',
    section: 'finance',
    implemented: true,
    keywords: ['loan', 'emi', 'interest', 'deposit', 'finance'],
  },
  {
    id: 'financial-utilities',
    name: 'Financial Utilities',
    category: 'Banking & Finance',
    description: 'GST, salary breakdowns and income-tax estimation.',
    section: 'utilities',
    implemented: true,
    keywords: ['gst', 'salary', 'tax', 'utilities'],
  },
  {
    id: 'statistics-probability',
    name: 'Statistics & Probability',
    category: 'Statistics',
    description: 'Descriptive statistics, distributions, permutations, combinations and probability.',
    section: 'statistics',
    implemented: true,
    keywords: ['statistics', 'probability', 'distribution', 'mean', 'median'],
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'Unit Conversion',
    description: 'Convert length, mass, temperature, pressure, energy and other physical units.',
    section: 'units',
    implemented: true,
    keywords: ['units', 'conversion', 'convert'],
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    category: 'Unit Conversion',
    description: 'Convert currencies using a live exchange-rate provider.',
    section: 'currency',
    implemented: false,
    keywords: ['currency', 'exchange', 'forex'],
  },
]

export function implementedCalculators(): CalculatorEntry[] {
  return calculatorDirectory.filter(entry => entry.implemented)
}

export function getCalculator(id: string): CalculatorEntry | undefined {
  return calculatorDirectory.find(entry => entry.id === id)
}

export function calculatorsByCategory(category: CalculatorCategory | 'All' = 'All'): CalculatorEntry[] {
  const visible = implementedCalculators()
  if (category === 'All') return visible
  return visible.filter(entry => entry.category === category)
}

export function searchCalculators(query: string, category: CalculatorCategory | 'All' = 'All'): CalculatorEntry[] {
  const normalized = query.trim().toLowerCase()
  return calculatorsByCategory(category).filter(entry => {
    if (!normalized) return true
    const haystack = [entry.name, entry.description, entry.category, ...(entry.keywords ?? [])].join(' ').toLowerCase()
    return haystack.includes(normalized)
  })
}
