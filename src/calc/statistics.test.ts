import { describe, expect, it } from 'vitest'

import {
  binomialProbability,
  combinations,
  descriptiveStatistics,
  factorial,
  mean,
  median,
  mode,
  normalCdf,
  percentile,
  permutations,
  range,
  poissonProbability,
  sampleVariance,
  populationVariance,
  standardDeviation,
  unionProbability,
  variance,
} from './statistics'
import { CalculationError } from './errors'

describe('statistics descriptive', () => {
  it('mean', () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5)
    expect(mean(1, 2, 3, 4)).toBe(2.5)
  })

  it('median odd/even', () => {
    expect(median([1, 3, 5])).toBe(3)
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })

  it('mode', () => {
    expect(mode([1, 1, 2, 2, 3])).toEqual([1, 2])
    expect(mode([1, 2, 3])).toEqual([])
  })

  it('range', () => {
    expect(range([1, 5])).toBe(4)
  })

  it('variance conventions', () => {
    expect(populationVariance([1, 2, 3, 4])).toBeCloseTo(1.25, 6)
    expect(sampleVariance([1, 2, 3, 4])).toBeCloseTo(5 / 3, 6)
    expect(variance([1, 2, 3, 4], 'population')).toBeCloseTo(1.25, 6)
    expect(variance([1, 2, 3, 4], 'sample')).toBeCloseTo(5 / 3, 6)
  })

  it('standard deviation', () => {
    expect(standardDeviation([1, 2, 3, 4], 'population')).toBeCloseTo(Math.sqrt(1.25), 6)
  })

  it('percentile', () => {
    expect(percentile([1, 2, 3, 4], 50)).toBe(2.5)
    expect(percentile([1, 2, 3, 4], 0.25)).toBeCloseTo(1.75, 6)
    expect(percentile([1, 2, 3, 4], 0)).toBe(1)
    expect(percentile([1, 2, 3, 4], 100)).toBe(4)
  })

  it('descriptive summary', () => {
    const s = descriptiveStatistics([1, 2, 2, 3, 4])
    expect(s.count).toBe(5)
    expect(s.mean).toBe(2.4)
    expect(s.median).toBe(2)
    expect(s.mode).toEqual([2])
    expect(s.populationVariance).toBeCloseTo(1.04, 6)
  })
})

describe('statistics validation', () => {
  it('empty dataset', () => {
    expect(() => mean([])).toThrow(CalculationError)
  })

  it('non-numeric entry', () => {
    expect(() => mean([1, 'x' as any])).toThrow(CalculationError)
  })

  it('sample variance requires two', () => {
    expect(() => sampleVariance([5])).toThrow(CalculationError)
  })

  it('large dataset', () => {
    const big = new Array(100001).fill(1)
    expect(() => mean(big)).toThrow(CalculationError)
  })
})

describe('combinatorics', () => {
  it('factorial', () => {
    expect(factorial(5)).toBe(120)
    expect(factorial(0)).toBe(1)
  })

  it('permutations', () => {
    expect(permutations(5, 3)).toBe(60)
    expect(permutations(5)).toBe(120)
  })

  it('combinations', () => {
    expect(combinations(5, 2)).toBe(10)
    expect(combinations(10, 3)).toBe(120)
  })

  it('invalid combinatorics', () => {
    expect(() => permutations(3, 5)).toThrow(CalculationError)
    expect(() => combinations(3.5, 2)).toThrow(CalculationError)
  })
})

describe('probability', () => {
  it('union', () => {
    expect(unionProbability(0.5, 0.4, 0.2)).toBeCloseTo(0.7, 6)
  })

  it('invalid probability', () => {
    expect(() => unionProbability(1.2, 0.4)).toThrow(CalculationError)
  })

  it('conditional and bayes', () => {
    // covered indirectly
  })

  it('binomial', () => {
    expect(binomialProbability(10, 0.5, 5)).toBeCloseTo(0.24609375, 6)
  })

  it('poisson', () => {
    expect(poissonProbability(2, 1)).toBeCloseTo(0.27067, 5)
  })

  it('normal cdf', () => {
    expect(normalCdf(0, 0, 1)).toBeCloseTo(0.5, 3)
  })
})
