# CalcSpace

**CalcSpace** - Everyday Calculations

A comprehensive, client-side web calculator application covering mathematics, physics, finance, unit conversions, and more. All calculations run entirely in the browser with no network required.


## 📱 Live Demo

Visit your deployed CalcSpace instance.

## ✨ Features

### Calculator Categories

CalcSpace includes over 20 calculator categories:

| Category | Description |
|---|---|
| **Arithmetic** | Basic arithmetic, expression evaluation |
| **Scientific** | Trigonometric functions (rad/deg), logarithms, roots, factorials |
| **Advanced** | Equation solving, differentiation, integration |
| **Physics** | F=ma, kinetic energy, potential energy, work, power |
| **Finance** | EMI, FD, RD, simple/compound interest |
| **Everyday Math** | Percentages, ratio simplification |
| **Matrix & Vector** | Matrix operations, vector calculations |
| **Numerical Math** | Limits, series summation |
| **Statistics & Probability** | Descriptive stats, distributions |
| **Electricity & Circuits** | Ohm's law, power, capacitance |
| **Waves, Optics, Heat & Fluids** | Wave properties, optical calculations |
| **Formula Library** | Searchable physics/math formulas |
| **Financial Utilities** | Amortization schedules, discount calculations |
| **Investment** | SIP, lump-sum growth projections |
| **Commerce** | Markup/margin, profit calculations |
| **Polynomial** | Polynomial operations, root finding |
| **Complex Numbers** | Complex arithmetic, polar form |
| **Unit Converter** | Length, area, volume, mass, temperature |
| **History & Favorites** | Local calculation history persistence |
| **Function Graphing** | Plot functions using chart.js (loaded on-demand) |
| **Calculator Directory** | Browse and search available calculators |

## 🛠 Technology Stack

- **Frontend**: React 19, Vite 8
- **Styling**: CSS with custom properties, responsive design
- **Math Library**: mathjs (expression evaluation and parsing)
- **Symbolic Math**: nerdamer (advanced calculus, differentiation, integration)
- **Graphing**: chart.js (loaded dynamically via dynamic import)
- **Testing**: Vitest, React Testing Library, jsdom
- **Type Safety**: TypeScript 7
- **Build**: Vite bundler with rollup code splitting

## ⚙️ Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 1.22.0
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🏃 Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Vite) |
| `npm test` | Run test suite (Vitest) |
| `npm run test:watch` | Run test suite in watch mode |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |

## 🧪 Testing

The project includes **40 test files with 362 tests** covering calculator modules, React components, integration tests, and edge cases.

### Running Tests

`ash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# View test coverage
npm run test -- --coverage
`

## 📁 Project Structure

`
calcspace/
├── src/
│   ├── App.tsx          # Main application component with lazy loading
│   ├── main.tsx         # Application entry point
│   ├── vite.config.ts   # Vite configuration
│   ├── index.ts         # Module re-exports
│   ├── calc/
│   │   ├── arithmetic.ts        # Basic arithmetic + expression evaluation
│   │   ├── physics.ts           # Physics equations (F=ma, KE, PE, etc.)
│   │   ├── finance.ts           # Financial formulas (EMI, FD, RD)
│   │   ├── scientific.ts        # Scientific functions and evaluation
│   │   ├── everyday.ts          # Percentage, ratio, proportion functions
│   │   ├── units.ts             # Unit converter with 100+ units
│   │   ├── ... (25+ more calc modules)
│   │   ├── arithmetic.test.ts   # 8 tests
│   │   ├── physics.test.ts      # 19 tests
│   │   ├── finance.test.ts      # 13 tests
│   │   └── ... (36 more test files)
│   ├── components/
│   │   ├── ArithmeticSection.tsx       # Calculator UI
│   │   ├── PhysicsSection.tsx        # Physics calculator UI
│   │   ├── FinanceSection.tsx        # Finance calculator UI
│   │   ├── UnitConverterSection.tsx  # Unit converter UI
│   │   ├── FunctionGraphingSection.tsx # Graphs (chart.js, lazy-loaded)
│   │   ├── ... (20+ section components)
│   │   ├── ArithmeticSection.test.tsx   # 23 tests
│   │   └── ... (39 more component test files)
│   ├── hooks/
│   │   └── useCalculationHistory.tsx # History state management
│   ├── test/
│   │   └── setup.ts      # Test setup and cleanup
│   └── calc/
│       └── index.ts           # Module re-exports (30+ exports)
├── dist/                  # Production build output
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
`

## 🔢 Expression Syntax

### Arithmetic Expressions

`	ext
# Basic operations
2 + 3        → 5
2 * 3        → 6
10 / 2       → 5

# Power and roots
2 ^ 3        → 8
sqrt(9)      → 3
cbrt(27)     → 3
nthRoot(16, 4) → 2

# Percentage
50%          → 0.5
200 % 10     → 20

# Operators
+  -  *  /  ^  %  !  (  )

# Constants
pi, PI, e, E, tau, phi

# Functions
abs(x), floor(x), ceil(x), round(x), sign(x)
sqrt(x), cbrt(x), nthRoot(x, y)
sin(x), cos(x), tan(x) [rad/deg mode]
log(x), log10(x), ln(x)
factorial(x)
min(x, y, ...), max(x, y, ...)
hypot(x, y, ...)

# Unsupported (throws CalculationError)
- Arbitrary property access: constructor
- Malformed expressions: 2 +
- Division by zero in safe mode
- Complex number results
`

## 💰 Financial Assumptions

All financial calculations follow standard formulas:

1. **EMI (Equated Monthly Installment)**:
   - Formula: P × r × (1+r)^n / ((1+r)^n - 1)
   - P = principal, r = monthly rate (annual%/1200), n = tenure in months
   - Assumes fixed interest rate for entire tenure

2. **Simple Interest**:
   - Formula: (P × R × T) / 100
   - P = principal, R = annual rate%, T = time in years

3. **Compound Interest**:
   - Formula: P × (1 + r/n)^(n×t) - P
   - Compounding frequency n defaults to 1 (annual)

4. **FD/Maturity Value**:
   - Formula: P × (1 + r/100)^t (annual compounding)
   - Or P × (1 + r/(100×n))^(n×t) for frequency n

5. **RD/Maturity Value**:
   - Quarterly compounding by default (n=4)
   - Formula uses recurring deposit amount, rate, and tenure

## ⚠️ Known Limitations

1. **Graphing section requires chart.js** - loaded on-demand, not included in initial bundle
2. **Complex number detection** - scientific calculator throws DOMAIN_ERROR for sqrt(-1) (real numbers only)
3. **Floating point precision** - standard JavaScript number limitations apply
4. **Temperature conversions** - offset conversions (C↔F, C↔K) are accurate, ratio conversions require absolute zero awareness
5. **Financial calculations** - assumes fixed rates, no inflation adjustment
6. **Unit converter** - ratio conversions (e.g., bits/bytes) assume binary/metric definitions as implemented
7. **Expression parsing** - mathjs may differ from standard mathematical notation in edge cases
8. **Matrix operations** - limited to basic operations, not symbolic manipulation

## 📦 How to Add a New Calculator

### 1. Create the calculation module
Add functions in src/calc/<name>.ts:

`	ypescript
export function myFunction(a: number, b: number): number {
  const aFinite = requireFinite(a, 'a')
  const bFinite = requireFinite(b, 'b')
  return aFinite + bFinite
}
`

### 2. Export from index
Add to src/calc/index.ts:

`	ypescript
export * from './<name>'
`

### 3. Create the React component
Add to src/components/<Name>Section.tsx:

`	ypescript
export function <Name>Section() {
  // UI with input, calculate button, result display
  // Use useCalculationHistory() for history
  // Use CalculationError for error handling
}
`

### 4. Register in App
Add to src/App.tsx:

`	ypescript
const <Name>Section = lazy(() => import('./components/<Name>Section'))
// Add to navItems array
`

### 5. Add tests
Create src/calc/<name>.test.ts and src/components/<Name>Section.test.tsx following existing patterns.

## 🌐 Deployment

### Static Hosting (Recommended)

Deploy the dist/ folder to any static hosting provider:

#### Vercel
`ash
vercel --prod
`

#### Netlify
`ash
netlify deploy --dir dist
`

#### GitHub Pages
`ash
npm run build
# Then deploy dist/ folder via GitHub Pages action
`

### Environment Variables

No environment variables required. The application is fully client-side.

## 📜 License

MIT License - Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

- mathjs library for expression evaluation
- nerdamer for symbolic mathematics
- chart.js for function graphing
- Vitest for testing
- All contributors and users
