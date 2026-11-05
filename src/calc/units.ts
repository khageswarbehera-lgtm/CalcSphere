import { CalculationError } from './errors'
import { requireFinite } from './validation'

export interface UnitDefinition {
  id: string
  name: string
  category: string
  dimension: string
  toBase: (value: number) => number
  fromBase: (value: number) => number
  aliases?: string[]
}

const units: UnitDefinition[] = []

function linear(id: string, name: string, category: string, dimension: string, factor: number, aliases: string[] = []): void {
  units.push({
    id,
    name,
    category,
    dimension,
    toBase: value => value * factor,
    fromBase: value => value / factor,
    aliases,
  })
}

function temperature(id: string, name: string, toBase: (value: number) => number, fromBase: (value: number) => number, aliases: string[] = []): void {
  units.push({ id, name, category: 'temperature', dimension: 'temperature', toBase, fromBase, aliases })
}

// Length
linear('m', 'meter', 'length', 'length', 1, ['meter', 'meters', 'metre', 'metres'])
linear('km', 'kilometer', 'length', 'length', 1000, ['kilometer', 'kilometers', 'kilometre'])
linear('cm', 'centimeter', 'length', 'length', 0.01, ['centimeter', 'centimeters', 'centimetre'])
linear('mm', 'millimeter', 'length', 'length', 0.001, ['millimeter', 'millimeters', 'millimetre'])
linear('um', 'micrometer', 'length', 'length', 1e-6, ['micrometer', 'micrometre', 'micron'])
linear('in', 'inch', 'length', 'length', 0.0254, ['inch', 'inches'])
linear('ft', 'foot', 'length', 'length', 0.3048, ['foot', 'feet'])
linear('yd', 'yard', 'length', 'length', 0.9144, ['yard', 'yards'])
linear('mi', 'mile', 'length', 'length', 1609.344, ['mile', 'miles'])
linear('nmi', 'nautical mile', 'length', 'length', 1852, ['nautical mile', 'nautical miles'])

// Area
linear('m2', 'square meter', 'area', 'area', 1, ['m^2', 'sq m', 'square meter', 'square meters'])
linear('cm2', 'square centimeter', 'area', 'area', 1e-4, ['cm^2', 'sq cm'])
linear('km2', 'square kilometer', 'area', 'area', 1e6, ['km^2', 'sq km'])
linear('ft2', 'square foot', 'area', 'area', 0.09290304, ['ft^2', 'sq ft', 'square foot', 'square feet'])
linear('in2', 'square inch', 'area', 'area', 0.00064516, ['in^2', 'sq in'])
linear('acre', 'acre', 'area', 'area', 4046.8564224, ['acres'])
linear('ha', 'hectare', 'area', 'area', 10000, ['hectare', 'hectares'])

// Volume
linear('m3', 'cubic meter', 'volume', 'volume', 1, ['m^3', 'cubic meter', 'cubic meters'])
linear('L', 'liter', 'volume', 'volume', 0.001, ['liter', 'liters', 'litre', 'litres'])
linear('mL', 'milliliter', 'volume', 'volume', 1e-6, ['milliliter', 'milliliters', 'millilitre'])
linear('cm3', 'cubic centimeter', 'volume', 'volume', 1e-6, ['cm^3', 'cc'])
linear('ft3', 'cubic foot', 'volume', 'volume', 0.028316846592, ['ft^3', 'cubic foot', 'cubic feet'])
linear('in3', 'cubic inch', 'volume', 'volume', 0.000016387064, ['in^3', 'cubic inch', 'cubic inches'])
linear('gal', 'US gallon', 'volume', 'volume', 0.003785411784, ['gallon', 'gallons', 'US gallon'])
linear('qt', 'US quart', 'volume', 'volume', 0.000946352946, ['quart', 'quarts'])
linear('pt', 'US pint', 'volume', 'volume', 0.000473176473, ['pint', 'pints'])
linear('cup', 'US cup', 'volume', 'volume', 0.0002365882365, ['cup', 'cups'])

// Mass
linear('kg', 'kilogram', 'mass', 'mass', 1, ['kilogram', 'kilograms', 'kilogramme'])
linear('g', 'gram', 'mass', 'mass', 0.001, ['gram', 'grams', 'gramme'])
linear('mg', 'milligram', 'mass', 'mass', 1e-6, ['milligram', 'milligrams'])
linear('t', 'metric ton', 'mass', 'mass', 1000, ['ton', 'tons', 'tonne', 'tonnes', 'metric ton'])
linear('lb', 'pound', 'mass', 'mass', 0.45359237, ['pound', 'pounds', 'lbm'])
linear('oz', 'ounce', 'mass', 'mass', 0.028349523125, ['ounce', 'ounces'])
linear('st', 'stone', 'mass', 'mass', 6.35029318, ['stone', 'stones'])
// Temperature
temperature('K', 'kelvin', value => value, value => value, ['kelvin', 'kelvins'])
temperature('C', 'celsius', value => value + 273.15, value => value - 273.15, ['celsius', 'centigrade'])
temperature('F', 'fahrenheit', value => (value - 32) * 5 / 9 + 273.15, value => (value - 273.15) * 9 / 5 + 32, ['fahrenheit'])

// Time
linear('s', 'second', 'time', 'time', 1, ['second', 'seconds', 'sec'])
linear('ms', 'millisecond', 'time', 'time', 0.001, ['millisecond', 'milliseconds'])
linear('us', 'microsecond', 'time', 'time', 1e-6, ['microsecond', 'microseconds'])
linear('min', 'minute', 'time', 'time', 60, ['minute', 'minutes'])
linear('h', 'hour', 'time', 'time', 3600, ['hour', 'hours', 'hr'])
linear('day', 'day', 'time', 'time', 86400, ['day', 'days'])
linear('week', 'week', 'time', 'time', 604800, ['week', 'weeks'])
linear('yr', 'year', 'time', 'time', 31557600, ['year', 'years', 'yr'])

// Speed
linear('m/s', 'meter per second', 'speed', 'speed', 1, ['m/s', 'mps'])
linear('km/h', 'kilometer per hour', 'speed', 'speed', 1000 / 3600, ['km/h', 'kmh', 'kph'])
linear('mph', 'mile per hour', 'speed', 'speed', 0.44704, ['mph', 'mile per hour', 'miles per hour'])
linear('ft/s', 'foot per second', 'speed', 'speed', 0.3048, ['ft/s', 'fps'])
linear('knot', 'knot', 'speed', 'speed', 0.514444444, ['knot', 'knots', 'kn'])

// Acceleration
linear('m/s2', 'meter per second squared', 'acceleration', 'acceleration', 1, ['m/s^2', 'm/s2'])
linear('ft/s2', 'foot per second squared', 'acceleration', 'acceleration', 0.3048, ['ft/s^2', 'ft/s2'])
linear('g', 'standard gravity', 'acceleration', 'acceleration', 9.80665, ['g', 'gee', 'gravity'])

// Force
linear('N', 'newton', 'force', 'force', 1, ['newton', 'newtons'])
linear('kN', 'kilonewton', 'force', 'force', 1000, ['kilonewton', 'kilonewtons'])
linear('lbf', 'pound-force', 'force', 'force', 4.4482216152605, ['pound-force', 'pounds-force', 'lbf'])
linear('dyn', 'dyne', 'force', 'force', 1e-5, ['dyne', 'dynes'])

// Pressure
linear('Pa', 'pascal', 'pressure', 'pressure', 1, ['pascal', 'pascals'])
linear('kPa', 'kilopascal', 'pressure', 'pressure', 1000, ['kilopascal', 'kilopascals'])
linear('atm', 'atmosphere', 'pressure', 'pressure', 101325, ['atmosphere', 'atmospheres', 'atm'])
linear('bar', 'bar', 'pressure', 'pressure', 100000, ['bar', 'bars'])
linear('psi', 'pound per square inch', 'pressure', 'pressure', 6894.757293168, ['psi', 'pound per square inch'])
linear('mmHg', 'millimeter of mercury', 'pressure', 'pressure', 133.322387415, ['mmHg', 'millimeter of mercury', 'torr'])

// Energy
linear('J', 'joule', 'energy', 'energy', 1, ['joule', 'joules'])
linear('kJ', 'kilojoule', 'energy', 'energy', 1000, ['kilojoule', 'kilojoules'])
linear('cal', 'calorie', 'energy', 'energy', 4.184, ['calorie', 'calories', 'cal'])
linear('kcal', 'kilocalorie', 'energy', 'energy', 4184, ['kilocalorie', 'kilocalories', 'Calorie'])
linear('Wh', 'watt-hour', 'energy', 'energy', 3600, ['watt-hour', 'watt hours', 'Wh'])
linear('kWh', 'kilowatt-hour', 'energy', 'energy', 3600000, ['kilowatt-hour', 'kilowatt hours', 'kWh'])
linear('eV', 'electronvolt', 'energy', 'energy', 1.602176634e-19, ['electronvolt', 'electronvolts', 'eV'])
linear('BTU', 'British thermal unit', 'energy', 'energy', 1055.05585262, ['BTU', 'Btu', 'British thermal unit'])

// Power
linear('W', 'watt', 'power', 'power', 1, ['watt', 'watts'])
linear('kW', 'kilowatt', 'power', 'power', 1000, ['kilowatt', 'kilowatts'])
linear('MW', 'megawatt', 'power', 'power', 1e6, ['megawatt', 'megawatts'])
linear('hp', 'horsepower', 'power', 'power', 745.6998715822702, ['horsepower', 'hp', 'mechanical horsepower'])

// Frequency
linear('Hz', 'hertz', 'frequency', 'frequency', 1, ['hertz', 'Hz'])
linear('kHz', 'kilohertz', 'frequency', 'frequency', 1000, ['kilohertz', 'kHz'])
linear('MHz', 'megahertz', 'frequency', 'frequency', 1e6, ['megahertz', 'MHz'])
linear('GHz', 'gigahertz', 'frequency', 'frequency', 1e9, ['gigahertz', 'GHz'])
linear('rpm', 'revolutions per minute', 'frequency', 'frequency', 1 / 60, ['rpm', 'revolutions per minute'])

// Electrical
linear('V', 'volt', 'electrical', 'voltage', 1, ['volt', 'volts'])
linear('mV', 'millivolt', 'electrical', 'voltage', 0.001, ['millivolt', 'millivolts'])
linear('kV', 'kilovolt', 'electrical', 'voltage', 1000, ['kilovolt', 'kilovolts'])
linear('MV', 'megavolt', 'electrical', 'voltage', 1e6, ['megavolt', 'megavolts'])
linear('A', 'ampere', 'electrical', 'current', 1, ['ampere', 'amperes', 'amp'])
linear('mA', 'milliampere', 'electrical', 'current', 0.001, ['milliampere', 'milliamperes', 'mA'])
linear('kA', 'kiloampere', 'electrical', 'current', 1000, ['kiloampere', 'kiloamperes'])
linear('uA', 'microampere', 'electrical', 'current', 1e-6, ['microampere', 'microamperes', 'uA', 'µA'])
linear('ohm', 'ohm', 'electrical', 'resistance', 1, ['ohm', 'ohms', 'Ω'])
linear('mohm', 'milliohm', 'electrical', 'resistance', 0.001, ['milliohm', 'milliohms'])
linear('kohm', 'kiloohm', 'electrical', 'resistance', 1000, ['kiloohm', 'kiloohms', 'kΩ'])
linear('Mohm', 'megaohm', 'electrical', 'resistance', 1e6, ['megaohm', 'megaohms', 'MΩ'])
linear('F', 'farad', 'electrical', 'capacitance', 1, ['farad', 'farads'])
linear('mF', 'millifarad', 'electrical', 'capacitance', 0.001, ['millifarad', 'millifarads'])
linear('uF', 'microfarad', 'electrical', 'capacitance', 1e-6, ['microfarad', 'microfarads', 'uF', 'µF'])
linear('nF', 'nanofarad', 'electrical', 'capacitance', 1e-9, ['nanofarad', 'nanofarads'])
linear('pF', 'picofarad', 'electrical', 'capacitance', 1e-12, ['picofarad', 'picofarads'])
linear('C', 'coulomb', 'electrical', 'charge', 1, ['coulomb', 'coulombs'])
linear('mC', 'millicoulomb', 'electrical', 'charge', 0.001, ['millicoulomb', 'millicoulombs'])
linear('uC', 'microcoulomb', 'electrical', 'charge', 1e-6, ['microcoulomb', 'microcoulombs', 'uC', 'µC'])
linear('Ah', 'ampere-hour', 'electrical', 'charge', 3600, ['ampere-hour', 'ampere hours', 'Ah'])
linear('S', 'siemens', 'electrical', 'conductance', 1, ['siemens', 'mho', 'mhos'])
linear('mS', 'millisiemens', 'electrical', 'conductance', 0.001, ['millisiemens', 'mS'])
linear('uS', 'microsiemens', 'electrical', 'conductance', 1e-6, ['microsiemens', 'uS', 'µS'])
linear('H', 'henry', 'electrical', 'inductance', 1, ['henry', 'henries'])
linear('mH', 'millihenry', 'electrical', 'inductance', 0.001, ['millihenry', 'millihenries'])
linear('uH', 'microhenry', 'electrical', 'inductance', 1e-6, ['microhenry', 'microhenries', 'uH', 'µH'])

function candidates(id: string): UnitDefinition[] {
  const key = id.trim()
  const result: UnitDefinition[] = []
  for (const unit of units) {
    if (unit.id === key) result.push(unit)
    else if (unit.aliases?.some(alias => alias.toLowerCase() === key.toLowerCase())) result.push(unit)
  }
  if (result.length === 0) {
    for (const unit of units) {
      if (unit.id.toLowerCase() === key.toLowerCase()) result.push(unit)
    }
  }
  return result
}

export function getUnit(id: string): UnitDefinition | undefined {
  return candidates(id)[0]
}

export function unitIds(): string[] {
  return [...new Set(units.map(unit => unit.id))]
}

export function unitsByCategory(category: string): UnitDefinition[] {
  const seen = new Set<string>()
  return units.filter(unit => {
    if (unit.category !== category) return false
    if (seen.has(unit.id)) return false
    seen.add(unit.id)
    return true
  })
}

export function unitsByDimension(dimension: string): UnitDefinition[] {
  const seen = new Set<string>()
  return units.filter(unit => {
    if (unit.dimension !== dimension) return false
    if (seen.has(unit.id)) return false
    seen.add(unit.id)
    return true
  })
}

export function areCompatible(fromUnit: string, toUnit: string): boolean {
  const fromCandidates = candidates(fromUnit)
  const toCandidates = candidates(toUnit)
  return fromCandidates.some(from => toCandidates.some(to => from.dimension === to.dimension))
}

export function convertUnit(value: unknown, fromUnit: string, toUnit: string): number {
  const v = requireFinite(value, 'value')
  const fromCandidates = candidates(fromUnit)
  const toCandidates = candidates(toUnit)
  if (fromCandidates.length === 0) throw new CalculationError('INVALID_INPUT', `Unknown unit: ${fromUnit}`)
  if (toCandidates.length === 0) throw new CalculationError('INVALID_INPUT', `Unknown unit: ${toUnit}`)
  const from = fromCandidates.find(f => toCandidates.some(t => t.dimension === f.dimension)) ?? fromCandidates[0]
  const to = toCandidates.find(t => t.dimension === from.dimension) ?? toCandidates[0]
  if (from.dimension !== to.dimension) {
    throw new CalculationError('INVALID_INPUT', `Incompatible units: ${fromUnit} and ${toUnit}`)
  }
  const base = from.toBase(v)
  return to.fromBase(base)
}

export function formatUnitValue(value: number, precision = 6): string {
  if (!Number.isFinite(value)) return String(value)
  return Number(value.toPrecision(precision)).toString()
}

