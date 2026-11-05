export type CalculationErrorCode =
  | 'INVALID_INPUT'
  | 'DIVISION_BY_ZERO'
  | 'DOMAIN_ERROR'
  | 'OVERFLOW'
  | 'PARSE_ERROR'
  | 'UNKNOWN'
  | 'SINGULAR_MATRIX'
  | 'UNSUPPORTED_SYNTAX'

export class CalculationError extends Error {
  readonly code: CalculationErrorCode
  readonly cause?: unknown

  constructor(code: CalculationErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'CalculationError'
    this.code = code
    if (cause !== undefined) this.cause = cause
  }
}

export function isCalculationError(value: unknown): value is CalculationError {
  return value instanceof CalculationError
}