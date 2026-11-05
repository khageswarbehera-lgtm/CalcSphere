import nerdamer from 'nerdamer'

export type ExactResultOptions = {
  angleMode?: 'deg' | 'rad'
  degrees?: boolean
}

function convertDegreeTrigArguments(expression: string): string {
  let converted = ''
  for (let index = 0; index < expression.length;) {
    if (/[A-Za-z]/.test(expression[index])) {
      let end = index + 1
      while (end < expression.length && /[A-Za-z]/.test(expression[end])) end += 1
      const name = expression.slice(index, end)
      let open = end
      while (/\s/.test(expression[open] ?? '')) open += 1
      if (['sin', 'cos', 'tan'].includes(name) && expression[open] === '(') {
        let depth = 1
        let close = open + 1
        while (close < expression.length && depth > 0) {
          if (expression[close] === '(') depth += 1
          if (expression[close] === ')') depth -= 1
          close += 1
        }
        if (depth === 0) {
          const argument = convertDegreeTrigArguments(expression.slice(open + 1, close - 1))
          converted += `${name}((${argument})*pi/180)`
          index = close
          continue
        }
      }
      converted += name
      index = end
      continue
    }
    converted += expression[index]
    index += 1
  }
  return converted
}

function formatExactExpression(expression: string): string | undefined {
  const formatted = expression
    .replace(/sqrt\(([^()]+)\)/g, '√$1')
    .replace(/\bpi\b/g, 'π')
    .replace(/^\(1\/2\)\*√(.+)$/, '√$1/2')
    .replace(/^\(1\/2\)\*([0-9]+)$/, '$1/2')
    .replace(/\s+/g, '')

  return /^[\deπ.+\-*/^()√]+$/.test(formatted) ? formatted : undefined
}

export function getExactResult(
  expression: string,
  numericValue: number,
  options: ExactResultOptions = {},
): string | undefined {
  if (Number.isSafeInteger(numericValue)) return String(numericValue)
  const symbolicExpression = options.degrees || options.angleMode === 'deg'
    ? convertDegreeTrigArguments(expression)
    : expression

  try {
    const symbolic = nerdamer(symbolicExpression)
    const exactValue = Number(symbolic.evaluate().text('decimals'))
    const tolerance = Math.max(1e-12, Math.abs(numericValue) * 1e-12)
    if (!Number.isFinite(exactValue) || Math.abs(exactValue - numericValue) > tolerance) return undefined
    return formatExactExpression(symbolic.toString())
  } catch {
    return undefined
  }
}

export function formatDecimalResult(value: number): string {
  if (Number.isInteger(value) || Math.abs(value) >= 1e21 || (value !== 0 && Math.abs(value) < 1e-8)) {
    return String(value)
  }
  return value.toFixed(8).replace(/\.?0+$/, '')
}
