import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'

import { AdvancedSection } from './components/AdvancedSection'
import { ArithmeticSection } from './components/ArithmeticSection'
import { CalculatorDirectorySection } from './components/CalculatorDirectorySection'
import { ElectricityCircuitsSection } from './components/ElectricityCircuitsSection'
import { EverydayMathSection } from './components/EverydayMathSection'
import { FinanceSection } from './components/FinanceSection'
import { FinancialUtilitiesSection } from './components/FinancialUtilitiesSection'
import { FormulaLibrarySection } from './components/FormulaLibrarySection'
import { FunctionGraphingSection } from './components/FunctionGraphingSection'
import { HistorySection } from './components/HistorySection'
import { MatrixVectorSection } from './components/MatrixVectorSection'
import { NumericalMathematicsSection } from './components/NumericalMathematicsSection'
import { PhysicsSection } from './components/PhysicsSection'
import { ScientificSection } from './components/ScientificSection'
import { StatisticsProbabilitySection } from './components/StatisticsProbabilitySection'
import { UnitConverterSection } from './components/UnitConverterSection'

const sections: [string, ReactElement][] = [
  ['Arithmetic', <ArithmeticSection />],
  ['Scientific', <ScientificSection />],
  ['Advanced', <AdvancedSection />],
  ['Physics', <PhysicsSection />],
  ['Finance', <FinanceSection />],
  ['Everyday', <EverydayMathSection />],
  ['Matrix', <MatrixVectorSection />],
  ['Numerical', <NumericalMathematicsSection />],
  ['Statistics', <StatisticsProbabilitySection />],
  ['Electricity', <ElectricityCircuitsSection />],
  ['Formulas', <FormulaLibrarySection />],
  ['FinancialUtilities', <FinancialUtilitiesSection />],
  ['Units', <UnitConverterSection />],
  ['History', <HistorySection />],
  ['Directory', <CalculatorDirectorySection />],
  ['Graphing', <FunctionGraphingSection />],
]

async function runAxe(ui: ReactElement) {
  const { container } = render(ui)
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag22aa'] },
  })
  return results.violations
}

describe('accessibility sections', () => {
  for (const [name, ui] of sections) {
    it(`${name} has no axe violations`, async () => {
      const violations = await runAxe(ui)
      if (violations.length) {
        console.log(name, JSON.stringify(violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => n.html).slice(0, 3) })), null, 2))
      }
      expect(violations).toHaveLength(0)
    })
  }
})


