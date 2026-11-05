import nerdamer from 'nerdamer/all'

import { CalculationError } from './errors'

export function solveEquation(equation: string, variable: string): string {
  try {
    return nerdamer.solve(equation, variable).toString()
  } catch (error) {
    throw new CalculationError('PARSE_ERROR', 'Unable to solve equation', error)
  }
}

export function differentiate(expression: string, variable: string): string {
  try {
    return nerdamer(`diff(${expression},${variable})`).toString()
  } catch (error) {
    throw new CalculationError('PARSE_ERROR', 'Unable to calculate derivative', error)
  }
}

export function integrate(expression: string, variable: string): string {
  try {
    return nerdamer(`integrate(${expression},${variable})`).toString()
  } catch (error) {
    throw new CalculationError('PARSE_ERROR', 'Unable to calculate integral', error)
  }
}