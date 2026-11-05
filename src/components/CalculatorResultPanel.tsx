type CalculatorResultPanelProps = {
  expression: string
  exactResult?: string
  decimalResult?: string
  error?: string
}

export function CalculatorResultPanel({
  expression,
  exactResult,
  decimalResult,
  error,
}: CalculatorResultPanelProps) {
  return (
    <div className="calculator-result-panel" aria-live="polite">
      <span className="calculator-result-label">RESULT</span>
      {expression && (
        <div className="calculator-result-expression">
          <span>Expression</span>
          <strong>{expression}</strong>
        </div>
      )}
      {error ? (
        <output className="calculator-result-value result result--error">{error}</output>
      ) : (
        <>
          {exactResult && (
            <div className="calculator-result-value calculator-exact-result">
              <span>Exact result</span>
              <output className="result">{exactResult}</output>
            </div>
          )}
          {decimalResult && (
            <div className={`calculator-result-value calculator-decimal-result${exactResult ? '' : ' calculator-decimal-result--primary'}`}>
              <span>Decimal approximation</span>
              <output className={exactResult ? '' : 'result'}>{decimalResult}</output>
            </div>
          )}
        </>
      )}
    </div>
  )
}
