export type FormulaCategory = 'mechanics' | 'electricity' | 'waves' | 'optics' | 'thermodynamics' | 'fluids'

export interface FormulaVariable {
  symbol: string
  description: string
  unit: string
}

export interface WorkedExample {
  given: string
  result: string
}

export interface CalculatorLink {
  label: string
  section: string
}

export interface FormulaEntry {
  id: string
  category: FormulaCategory
  title: string
  formula: string
  variables: FormulaVariable[]
  resultUnit: string
  assumptions: string[]
  example: WorkedExample
  calculator: CalculatorLink
  reference: string
}

export const formulaCategories: { id: FormulaCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'mechanics', label: 'Mechanics' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'waves', label: 'Waves' },
  { id: 'optics', label: 'Optics' },
  { id: 'thermodynamics', label: 'Thermodynamics' },
  { id: 'fluids', label: 'Fluids' },
]

const REFERENCE = 'Standard introductory physics reference (e.g., Halliday, Resnick, and Walker)'

export const physicsFormulas: FormulaEntry[] = [
  {
    id: 'mechanics-newton-second-law',
    category: 'mechanics',
    title: "Newton's second law",
    formula: 'F = m a',
    variables: [
      { symbol: 'F', description: 'net force', unit: 'N' },
      { symbol: 'm', description: 'mass', unit: 'kg' },
      { symbol: 'a', description: 'acceleration', unit: 'm/s²' },
    ],
    resultUnit: 'N',
    assumptions: ['Point mass or rigid body treated as a particle', 'Inertial reference frame', 'Consistent SI units'],
    example: { given: 'm = 10 kg, a = 9.8 m/s²', result: 'F = 98 N' },
    calculator: { label: 'Mechanics', section: 'physics' },
    reference: REFERENCE,
  },
  {
    id: 'mechanics-kinetic-energy',
    category: 'mechanics',
    title: 'Kinetic energy',
    formula: 'K = 1/2 m v^2',
    variables: [
      { symbol: 'K', description: 'kinetic energy', unit: 'J' },
      { symbol: 'm', description: 'mass', unit: 'kg' },
      { symbol: 'v', description: 'speed', unit: 'm/s' },
    ],
    resultUnit: 'J',
    assumptions: ['Non-relativistic speeds', 'Point mass', 'Consistent SI units'],
    example: { given: 'm = 10 kg, v = 20 m/s', result: 'K = 2000 J' },
    calculator: { label: 'Mechanics', section: 'physics' },
    reference: REFERENCE,
  },
  {
    id: 'mechanics-gravitational-potential-energy',
    category: 'mechanics',
    title: 'Gravitational potential energy',
    formula: 'U = m g h',
    variables: [
      { symbol: 'U', description: 'gravitational potential energy', unit: 'J' },
      { symbol: 'm', description: 'mass', unit: 'kg' },
      { symbol: 'g', description: 'acceleration due to gravity', unit: 'm/s²' },
      { symbol: 'h', description: 'height above reference', unit: 'm' },
    ],
    resultUnit: 'J',
    assumptions: ['Uniform gravitational field near Earth surface', 'Reference height chosen consistently'],
    example: { given: 'm = 2 kg, g = 9.8 m/s², h = 5 m', result: 'U = 98 J' },
    calculator: { label: 'Mechanics', section: 'physics' },
    reference: REFERENCE,
  },
  {
    id: 'mechanics-momentum',
    category: 'mechanics',
    title: 'Linear momentum',
    formula: 'p = m v',
    variables: [
      { symbol: 'p', description: 'momentum', unit: 'kg m/s' },
      { symbol: 'm', description: 'mass', unit: 'kg' },
      { symbol: 'v', description: 'velocity', unit: 'm/s' },
    ],
    resultUnit: 'kg m/s',
    assumptions: ['Non-relativistic mechanics', 'Consistent SI units'],
    example: { given: 'm = 2 kg, v = 3 m/s', result: 'p = 6 kg m/s' },
    calculator: { label: 'Mechanics', section: 'physics' },
    reference: REFERENCE,
  },
  {
    id: 'mechanics-work',
    category: 'mechanics',
    title: 'Work by a constant force',
    formula: 'W = F d cos θ',
    variables: [
      { symbol: 'W', description: 'work', unit: 'J' },
      { symbol: 'F', description: 'force magnitude', unit: 'N' },
      { symbol: 'd', description: 'displacement magnitude', unit: 'm' },
      { symbol: 'θ', description: 'angle between force and displacement', unit: 'deg' },
    ],
    resultUnit: 'J',
    assumptions: ['Constant force', 'Straight-line displacement'],
    example: { given: 'F = 10 N, d = 5 m, θ = 60°', result: 'W = 25 J' },
    calculator: { label: 'Mechanics', section: 'physics' },
    reference: REFERENCE,
  },
  {
    id: 'mechanics-centripetal-force',
    category: 'mechanics',
    title: 'Centripetal force',
    formula: 'F_c = m v^2 / r',
    variables: [
      { symbol: 'F_c', description: 'centripetal force', unit: 'N' },
      { symbol: 'm', description: 'mass', unit: 'kg' },
      { symbol: 'v', description: 'tangential speed', unit: 'm/s' },
      { symbol: 'r', description: 'radius', unit: 'm' },
    ],
    resultUnit: 'N',
    assumptions: ['Uniform circular motion', 'Consistent SI units'],
    example: { given: 'm = 2 kg, v = 4 m/s, r = 2 m', result: 'F_c = 16 N' },
    calculator: { label: 'Mechanics', section: 'physics' },
    reference: REFERENCE,
  },

  {
    id: 'electricity-ohms-law',
    category: 'electricity',
    title: "Ohm's law",
    formula: 'V = I R',
    variables: [
      { symbol: 'V', description: 'voltage', unit: 'V' },
      { symbol: 'I', description: 'current', unit: 'A' },
      { symbol: 'R', description: 'resistance', unit: 'Ω' },
    ],
    resultUnit: 'V',
    assumptions: ['Ideal conductor', 'Constant temperature', 'DC or instantaneous values'],
    example: { given: 'I = 3 A, R = 4 Ω', result: 'V = 12 V' },
    calculator: { label: 'Electricity', section: 'electricity' },
    reference: REFERENCE,
  },
  {
    id: 'electricity-power',
    category: 'electricity',
    title: 'Electrical power',
    formula: 'P = V I = I^2 R = V^2 / R',
    variables: [
      { symbol: 'P', description: 'power', unit: 'W' },
      { symbol: 'V', description: 'voltage', unit: 'V' },
      { symbol: 'I', description: 'current', unit: 'A' },
      { symbol: 'R', description: 'resistance', unit: 'Ω' },
    ],
    resultUnit: 'W',
    assumptions: ['Ideal resistor', 'Consistent SI units'],
    example: { given: 'V = 12 V, I = 3 A', result: 'P = 36 W' },
    calculator: { label: 'Electricity', section: 'electricity' },
    reference: REFERENCE,
  },
  {
    id: 'electricity-energy-kwh',
    category: 'electricity',
    title: 'Electrical energy',
    formula: 'E = P t / 1000',
    variables: [
      { symbol: 'E', description: 'energy', unit: 'kWh' },
      { symbol: 'P', description: 'power', unit: 'W' },
      { symbol: 't', description: 'time', unit: 'h' },
    ],
    resultUnit: 'kWh',
    assumptions: ['Constant power', 'Ideal metering'],
    example: { given: 'P = 1000 W, t = 2 h', result: 'E = 2 kWh' },
    calculator: { label: 'Electricity', section: 'electricity' },
    reference: REFERENCE,
  },
  {
    id: 'electricity-series-resistance',
    category: 'electricity',
    title: 'Series resistance',
    formula: 'R_eq = R_1 + R_2 + ...',
    variables: [{ symbol: 'R_eq', description: 'equivalent resistance', unit: 'Ω' }],
    resultUnit: 'Ω',
    assumptions: ['Ideal resistors', 'Same current through all components'],
    example: { given: 'R = 2, 3, 4 Ω', result: 'R_eq = 9 Ω' },
    calculator: { label: 'Electricity', section: 'electricity' },
    reference: REFERENCE,
  },
  {
    id: 'electricity-parallel-resistance',
    category: 'electricity',
    title: 'Parallel resistance',
    formula: '1/R_eq = 1/R_1 + 1/R_2 + ...',
    variables: [{ symbol: 'R_eq', description: 'equivalent resistance', unit: 'Ω' }],
    resultUnit: 'Ω',
    assumptions: ['Ideal resistors', 'Same voltage across all components'],
    example: { given: 'R = 2, 3 Ω', result: 'R_eq = 1.2 Ω' },
    calculator: { label: 'Electricity', section: 'electricity' },
    reference: REFERENCE,
  },
  {
    id: 'electricity-capacitor-energy',
    category: 'electricity',
    title: 'Capacitor stored energy',
    formula: 'U = 1/2 C V^2',
    variables: [
      { symbol: 'U', description: 'stored energy', unit: 'J' },
      { symbol: 'C', description: 'capacitance', unit: 'F' },
      { symbol: 'V', description: 'voltage', unit: 'V' },
    ],
    resultUnit: 'J',
    assumptions: ['Ideal capacitor', 'Fully charged'],
    example: { given: 'C = 1e-6 F, V = 10 V', result: 'U = 5e-5 J' },
    calculator: { label: 'Electricity', section: 'electricity' },
    reference: REFERENCE,
  },
  {
    id: 'electricity-transformer',
    category: 'electricity',
    title: 'Ideal transformer voltage',
    formula: 'V_s / V_p = N_s / N_p',
    variables: [
      { symbol: 'V_s', description: 'secondary voltage', unit: 'V' },
      { symbol: 'V_p', description: 'primary voltage', unit: 'V' },
      { symbol: 'N_s', description: 'secondary turns', unit: 'dimensionless' },
      { symbol: 'N_p', description: 'primary turns', unit: 'dimensionless' },
    ],
    resultUnit: 'V',
    assumptions: ['Ideal transformer', 'No losses', 'Sinusoidal steady state'],
    example: { given: 'V_p = 230 V, N_p = 100, N_s = 50', result: 'V_s = 115 V' },
    calculator: { label: 'Electricity', section: 'electricity' },
    reference: REFERENCE,
  },

  {
    id: 'waves-speed',
    category: 'waves',
    title: 'Wave speed',
    formula: 'v = f λ',
    variables: [
      { symbol: 'v', description: 'wave speed', unit: 'm/s' },
      { symbol: 'f', description: 'frequency', unit: 'Hz' },
      { symbol: 'λ', description: 'wavelength', unit: 'm' },
    ],
    resultUnit: 'm/s',
    assumptions: ['Linear wave in a uniform medium', 'Consistent SI units'],
    example: { given: 'f = 10 Hz, λ = 2 m', result: 'v = 20 m/s' },
    calculator: { label: 'Waves', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'waves-period',
    category: 'waves',
    title: 'Period',
    formula: 'T = 1 / f',
    variables: [
      { symbol: 'T', description: 'period', unit: 's' },
      { symbol: 'f', description: 'frequency', unit: 'Hz' },
    ],
    resultUnit: 's',
    assumptions: ['Periodic wave', 'f not zero'],
    example: { given: 'f = 50 Hz', result: 'T = 0.02 s' },
    calculator: { label: 'Waves', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'waves-sound-level',
    category: 'waves',
    title: 'Sound intensity level',
    formula: 'β = 10 log10(I / I_0)',
    variables: [
      { symbol: 'β', description: 'sound level', unit: 'dB' },
      { symbol: 'I', description: 'intensity', unit: 'W/m²' },
      { symbol: 'I_0', description: 'reference intensity', unit: 'W/m²' },
    ],
    resultUnit: 'dB',
    assumptions: ['Logarithmic scale', 'I_0 = 1e-12 W/m² commonly'],
    example: { given: 'I = 1e-6 W/m²', result: 'β = 60 dB' },
    calculator: { label: 'Waves', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'waves-doppler',
    category: 'waves',
    title: 'Doppler effect',
    formula: "f' = f (v + v_o)/(v - v_s)",
    variables: [
      { symbol: "f'", description: 'observed frequency', unit: 'Hz' },
      { symbol: 'f', description: 'source frequency', unit: 'Hz' },
      { symbol: 'v', description: 'wave speed', unit: 'm/s' },
      { symbol: 'v_o', description: 'observer speed toward source', unit: 'm/s' },
      { symbol: 'v_s', description: 'source speed toward observer', unit: 'm/s' },
    ],
    resultUnit: 'Hz',
    assumptions: ['Constant speeds', 'Source speed less than wave speed', 'Uniform medium'],
    example: { given: 'f = 440 Hz, v = 343 m/s, v_o = 0, v_s = 0', result: "f' = 440 Hz" },
    calculator: { label: 'Waves', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'optics-lens-equation',
    category: 'optics',
    title: 'Thin lens/mirror equation',
    formula: '1/f = 1/d_o + 1/d_i',
    variables: [
      { symbol: 'f', description: 'focal length', unit: 'cm or m' },
      { symbol: 'd_o', description: 'object distance', unit: 'cm or m' },
      { symbol: 'd_i', description: 'image distance', unit: 'cm or m' },
    ],
    resultUnit: 'length',
    assumptions: ['Thin lens or mirror', 'Paraxial rays', 'Consistent units'],
    example: { given: 'f = 10 cm, d_o = 30 cm', result: 'd_i = 15 cm' },
    calculator: { label: 'Optics', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'optics-magnification',
    category: 'optics',
    title: 'Magnification',
    formula: 'm = -d_i / d_o',
    variables: [
      { symbol: 'm', description: 'magnification', unit: 'dimensionless' },
      { symbol: 'd_i', description: 'image distance', unit: 'length' },
      { symbol: 'd_o', description: 'object distance', unit: 'length' },
    ],
    resultUnit: 'dimensionless',
    assumptions: ['Thin lens or mirror', 'Consistent units'],
    example: { given: 'd_i = 15 cm, d_o = 30 cm', result: 'm = -0.5' },
    calculator: { label: 'Optics', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'optics-snell',
    category: 'optics',
    title: "Snell's law",
    formula: 'n_1 sin θ_1 = n_2 sin θ_2',
    variables: [
      { symbol: 'n_1, n_2', description: 'refractive indices', unit: 'dimensionless' },
      { symbol: 'θ_1, θ_2', description: 'angles to normal', unit: 'deg or rad' },
    ],
    resultUnit: 'angle',
    assumptions: ['Planar interface', 'Isotropic media'],
    example: { given: 'θ_1 = 30°, n_1 = 1, n_2 = 1.5', result: 'θ_2 ≈ 19.5°' },
    calculator: { label: 'Optics', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'optics-critical-angle',
    category: 'optics',
    title: 'Critical angle',
    formula: 'sin θ_c = n_2 / n_1, n_1 > n_2',
    variables: [
      { symbol: 'θ_c', description: 'critical angle', unit: 'deg or rad' },
      { symbol: 'n_1, n_2', description: 'refractive indices', unit: 'dimensionless' },
    ],
    resultUnit: 'angle',
    assumptions: ['Light travels from denser to less dense medium', 'n_1 > n_2'],
    example: { given: 'n_1 = 1.5, n_2 = 1.0', result: 'θ_c ≈ 41.8°' },
    calculator: { label: 'Optics', section: 'waves' },
    reference: REFERENCE,
  },

  {
    id: 'thermodynamics-heat-transfer',
    category: 'thermodynamics',
    title: 'Heat transfer',
    formula: 'Q = m c ΔT',
    variables: [
      { symbol: 'Q', description: 'heat energy', unit: 'J' },
      { symbol: 'm', description: 'mass', unit: 'kg' },
      { symbol: 'c', description: 'specific heat', unit: 'J/kgK' },
      { symbol: 'ΔT', description: 'temperature change', unit: 'K' },
    ],
    resultUnit: 'J',
    assumptions: ['Constant specific heat', 'No phase change'],
    example: { given: 'm = 2 kg, c = 4184 J/kgK, ΔT = 10 K', result: 'Q = 83680 J' },
    calculator: { label: 'Thermodynamics', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'thermodynamics-ideal-gas',
    category: 'thermodynamics',
    title: 'Ideal gas law',
    formula: 'P V = n R T',
    variables: [
      { symbol: 'P', description: 'pressure', unit: 'Pa' },
      { symbol: 'V', description: 'volume', unit: 'm³' },
      { symbol: 'n', description: 'amount of substance', unit: 'mol' },
      { symbol: 'R', description: 'gas constant', unit: 'J/molK' },
      { symbol: 'T', description: 'absolute temperature', unit: 'K' },
    ],
    resultUnit: 'Pa (if solving for P)',
    assumptions: ['Ideal gas', 'Equilibrium state'],
    example: { given: 'n = 1 mol, T = 300 K, V = 0.024 m³', result: 'P ≈ 103925 Pa' },
    calculator: { label: 'Thermodynamics', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'thermodynamics-carnot',
    category: 'thermodynamics',
    title: 'Carnot efficiency',
    formula: 'η = 1 - T_c / T_h',
    variables: [
      { symbol: 'η', description: 'efficiency', unit: 'dimensionless' },
      { symbol: 'T_c', description: 'cold reservoir temperature', unit: 'K' },
      { symbol: 'T_h', description: 'hot reservoir temperature', unit: 'K' },
    ],
    resultUnit: 'dimensionless',
    assumptions: ['Reversible Carnot cycle', 'Temperatures in Kelvin', 'T_h > T_c'],
    example: { given: 'T_c = 300 K, T_h = 500 K', result: 'η = 0.4' },
    calculator: { label: 'Thermodynamics', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'thermodynamics-thermal-expansion',
    category: 'thermodynamics',
    title: 'Linear thermal expansion',
    formula: 'ΔL = α L_0 ΔT',
    variables: [
      { symbol: 'ΔL', description: 'length change', unit: 'm' },
      { symbol: 'α', description: 'linear expansion coefficient', unit: '1/K' },
      { symbol: 'L_0', description: 'initial length', unit: 'm' },
      { symbol: 'ΔT', description: 'temperature change', unit: 'K' },
    ],
    resultUnit: 'm',
    assumptions: ['Small temperature changes', 'Isotropic material'],
    example: { given: 'L_0 = 1 m, α = 1.2e-5 1/K, ΔT = 10 K', result: 'ΔL ≈ 1.2e-4 m' },
    calculator: { label: 'Thermodynamics', section: 'waves' },
    reference: REFERENCE,
  },

  {
    id: 'fluids-hydrostatic-pressure',
    category: 'fluids',
    title: 'Hydrostatic pressure',
    formula: 'P = ρ g h',
    variables: [
      { symbol: 'P', description: 'pressure', unit: 'Pa' },
      { symbol: 'ρ', description: 'fluid density', unit: 'kg/m³' },
      { symbol: 'g', description: 'gravity', unit: 'm/s²' },
      { symbol: 'h', description: 'depth', unit: 'm' },
    ],
    resultUnit: 'Pa',
    assumptions: ['Incompressible fluid', 'Constant gravity', 'Static fluid'],
    example: { given: 'ρ = 1000 kg/m³, g = 9.8 m/s², h = 2 m', result: 'P = 19600 Pa' },
    calculator: { label: 'Fluids', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'fluids-buoyancy',
    category: 'fluids',
    title: 'Buoyant force',
    formula: 'F_b = ρ V g',
    variables: [
      { symbol: 'F_b', description: 'buoyant force', unit: 'N' },
      { symbol: 'ρ', description: 'fluid density', unit: 'kg/m³' },
      { symbol: 'V', description: 'displaced volume', unit: 'm³' },
      { symbol: 'g', description: 'gravity', unit: 'm/s²' },
    ],
    resultUnit: 'N',
    assumptions: ['Incompressible fluid', 'Fully or partially submerged body'],
    example: { given: 'ρ = 1000 kg/m³, V = 0.01 m³, g = 9.8 m/s²', result: 'F_b = 98 N' },
    calculator: { label: 'Fluids', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'fluids-continuity',
    category: 'fluids',
    title: 'Continuity equation',
    formula: 'A_1 v_1 = A_2 v_2',
    variables: [
      { symbol: 'A', description: 'cross-sectional area', unit: 'm²' },
      { symbol: 'v', description: 'flow speed', unit: 'm/s' },
    ],
    resultUnit: 'm/s (for v_2)',
    assumptions: ['Incompressible flow', 'Steady flow', 'No leaks'],
    example: { given: 'A_1 = 0.02 m², v_1 = 3 m/s, A_2 = 0.01 m²', result: 'v_2 = 6 m/s' },
    calculator: { label: 'Fluids', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'fluids-bernoulli',
    category: 'fluids',
    title: 'Bernoulli equation',
    formula: 'P + 1/2 ρ v^2 + ρ g h = constant',
    variables: [
      { symbol: 'P', description: 'pressure', unit: 'Pa' },
      { symbol: 'ρ', description: 'density', unit: 'kg/m³' },
      { symbol: 'v', description: 'flow speed', unit: 'm/s' },
      { symbol: 'g', description: 'gravity', unit: 'm/s²' },
      { symbol: 'h', description: 'height', unit: 'm' },
    ],
    resultUnit: 'Pa',
    assumptions: ['Incompressible, non-viscous, steady flow', 'Along a streamline'],
    example: { given: 'P_1 = 100000 Pa, ρ = 1000 kg/m³, v_1 = 2 m/s, h_1 = 1 m, v_2 = 3 m/s, h_2 = 0 m', result: 'P_2 ≈ 107300 Pa' },
    calculator: { label: 'Fluids', section: 'waves' },
    reference: REFERENCE,
  },
  {
    id: 'fluids-reynolds',
    category: 'fluids',
    title: 'Reynolds number',
    formula: 'Re = ρ v D / μ',
    variables: [
      { symbol: 'Re', description: 'Reynolds number', unit: 'dimensionless' },
      { symbol: 'ρ', description: 'density', unit: 'kg/m³' },
      { symbol: 'v', description: 'velocity', unit: 'm/s' },
      { symbol: 'D', description: 'characteristic length', unit: 'm' },
      { symbol: 'μ', description: 'dynamic viscosity', unit: 'Pa s' },
    ],
    resultUnit: 'dimensionless',
    assumptions: ['Newtonian fluid', 'Consistent SI units'],
    example: { given: 'ρ = 1000 kg/m³, v = 2 m/s, D = 0.05 m, μ = 0.001 Pa s', result: 'Re = 100000' },
    calculator: { label: 'Fluids', section: 'waves' },
    reference: REFERENCE,
  },
]

export function searchFormulas(query: string, category: FormulaCategory | 'all' = 'all'): FormulaEntry[] {
  const normalized = query.trim().toLowerCase()
  return physicsFormulas.filter(entry => {
    if (category !== 'all' && entry.category !== category) return false
    if (!normalized) return true
    const haystack = [
      entry.title,
      entry.formula,
      entry.resultUnit,
      entry.assumptions.join(' '),
      entry.example.given,
      entry.example.result,
      entry.variables.map(v => `${v.symbol} ${v.description} ${v.unit}`).join(' '),
    ].join(' ').toLowerCase()
    return haystack.includes(normalized)
  })
}

export function getFormulaById(id: string): FormulaEntry | undefined {
  return physicsFormulas.find(entry => entry.id === id)
}

export function formulasByCategory(category: FormulaCategory): FormulaEntry[] {
  return physicsFormulas.filter(entry => entry.category === category)
}
