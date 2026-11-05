import { useState } from 'react'
import { Card } from './UI'
import {
  crossProduct,
  determinant,
  dotProduct,
  inverse,
  matrixAdd,
  matrixMultiply,
  matrixSubtract,
  parseMatrix,
  parseVector,
  transpose,
  vectorAdd,
  vectorMagnitude,
} from '../calc'

function MatrixDisplay({ m }: { m: number[][] }) {
  return (
    <div className="matrix-display">
      {m.map((row, i) => (
        <div key={i} className="matrix-row">
          {row.map((v, j) => (
            <span key={j} className="matrix-cell">{Number.isInteger(v) ? v : v.toFixed(4)}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

export function MatrixVectorSection() {
  const [a, setA] = useState('1 2\n3 4')
  const [b, setB] = useState('5 6\n7 8')
  const [v1, setV1] = useState('1, 2, 3')
  const [v2, setV2] = useState('4, 5, 6')
  const [matrixResult, setMatrixResult] = useState<number[][] | null>(null)
  const [scalarResult, setScalarResult] = useState<string>('')
  const [vectorResult, setVectorResult] = useState<number[] | null>(null)
  const [error, setError] = useState('')

  const run = (fn: () => void) => {
    setError('')
    setMatrixResult(null)
    setScalarResult('')
    setVectorResult(null)
    try {
      fn()
    } catch (e: any) {
      setError(e?.message ?? 'Invalid input')
    }
  }

  return (
    <div className="grid">
      <Card title="Matrix A">
        <textarea id="matrix-a" aria-label="Matrix A" value={a} onChange={e => setA(e.target.value)} rows={3} />
      </Card>
      <Card title="Matrix B">
        <textarea id="matrix-b" aria-label="Matrix B" value={b} onChange={e => setB(e.target.value)} rows={3} />
      </Card>

      <Card title="Matrix operations">
        <div className="action-buttons">
          <button onClick={() => run(() => setMatrixResult(matrixAdd(parseMatrix(a), parseMatrix(b))))}>A + B</button>
          <button onClick={() => run(() => setMatrixResult(matrixSubtract(parseMatrix(a), parseMatrix(b))))}>A − B</button>
          <button onClick={() => run(() => setMatrixResult(matrixMultiply(parseMatrix(a), parseMatrix(b))))}>A × B</button>
          <button onClick={() => run(() => setMatrixResult(transpose(parseMatrix(a))))}>Transpose A</button>
          <button onClick={() => run(() => setScalarResult(String(determinant(parseMatrix(a)))))}>det(A)</button>
          <button onClick={() => run(() => setMatrixResult(inverse(parseMatrix(a))))}>Inverse A</button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {matrixResult && <MatrixDisplay m={matrixResult} />}
        {scalarResult && <p>Result: {scalarResult}</p>}
      </Card>

      <Card title="Vectors (3D)">
        <label htmlFor="vector-1">Vector 1</label>
        <input id="vector-1" aria-label="Vector 1" value={v1} onChange={e => setV1(e.target.value)} />
        <label htmlFor="vector-2">Vector 2</label>
        <input id="vector-2" aria-label="Vector 2" value={v2} onChange={e => setV2(e.target.value)} />
        <div className="action-buttons">
          <button onClick={() => run(() => setVectorResult(vectorAdd(parseVector(v1), parseVector(v2))))}>Add</button>
          <button onClick={() => run(() => setScalarResult(String(dotProduct(parseVector(v1), parseVector(v2)))))}>Dot product</button>
          <button onClick={() => run(() => setVectorResult(crossProduct(parseVector(v1), parseVector(v2))))}>Cross product</button>
          <button onClick={() => run(() => setScalarResult(String(vectorMagnitude(parseVector(v1)))))}>Magnitude v1</button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {vectorResult && <p>Result: [{vectorResult.join(', ')}]</p>}
        {scalarResult && <p>Result: {scalarResult}</p>}
      </Card>
    </div>
  )
}