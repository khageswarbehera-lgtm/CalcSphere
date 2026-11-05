import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, NumberInput } from './UI'
import { evaluateGraphExpression, parseGraphExpression, sampleGraph, validateGraphRange } from '../calc'

export function FunctionGraphingSection() {
  const [expressions, setExpressions] = useState<string[]>(['sin(x)'])
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [points, setPoints] = useState(400)
  const [xLabel, setXLabel] = useState('x')
  const [yLabel, setYLabel] = useState('y')
  const [error, setError] = useState('')
  const [chartLib, setChartLib] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<any>(null)

  const samples = useMemo(() => {
    try {
      const range = validateGraphRange(xMin, xMax, points)
      const result = expressions.map(expression => {
        parseGraphExpression(expression)
        return { expression, points: sampleGraph(expression, range.xMin, range.xMax, range.points) }
      })
      setError('')
      return result
    } catch (e: any) {
      setError(e?.message ?? 'Invalid expression or range')
      return []
    }
  }, [expressions, xMin, xMax, points])

  useEffect(() => {
    let cancelled = false
    import('chart.js').then(module => {
      if (cancelled) return
      module.Chart.register(
        module.LineController,
        module.LineElement,
        module.PointElement,
        module.LinearScale,
        module.Title,
        module.Tooltip,
        module.Legend,
      )
      setChartLib(module)
    }).catch(() => {
      if (!cancelled) setError('Unable to load the graphing library')
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!chartLib || !canvasRef.current || samples.length === 0) return
    if (chartRef.current) chartRef.current.destroy()
    const datasets = samples.map((sample, index) => ({
      label: sample.expression,
      data: sample.points.map(point => ({ x: point.x, y: point.y })),
      borderColor: `hsl(${index * 70}, 70%, 50%)`,
      borderWidth: 2,
      pointRadius: 0,
      spanGaps: false,
    }))
    chartRef.current = new chartLib.Chart(canvasRef.current, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        animation: false,
        scales: {
          x: { type: 'linear', title: { display: true, text: xLabel } },
          y: { title: { display: true, text: yLabel } },
        },
        plugins: { legend: { display: datasets.length > 1 } },
      },
    })
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [chartLib, samples, xLabel, yLabel])

  const updateExpression = (index: number, value: string) => {
    setExpressions(current => current.map((item, i) => (i === index ? value : item)))
  }

  const addExpression = () => setExpressions(current => [...current, ''])
  const removeExpression = (index: number) => setExpressions(current => current.filter((_, i) => i !== index))

  const resetRange = () => {
    setXMin(-10)
    setXMax(10)
    setPoints(400)
  }

  return (
    <div className="grid math-grid">
      <Card title="Function graphing">
        <label htmlFor="graph-xmin">X minimum</label>
        <NumberInput label="X minimum" value={xMin} onChange={setXMin} />
        <label htmlFor="graph-xmax">X maximum</label>
        <NumberInput label="X maximum" value={xMax} onChange={setXMax} />
        <NumberInput label="Points" value={points} onChange={setPoints} />
        <label htmlFor="graph-xlabel">X axis label</label>
        <input id="graph-xlabel" aria-label="X axis label" value={xLabel} onChange={e => setXLabel(e.target.value)} />
        <label htmlFor="graph-ylabel">Y axis label</label>
        <input id="graph-ylabel" aria-label="Y axis label" value={yLabel} onChange={e => setYLabel(e.target.value)} />
        <button onClick={resetRange}>Reset range</button>
        <p>Use the restricted calculator syntax. Only x is available as a variable.</p>
        {error && <p role="alert">{error}</p>}
      </Card>

      <Card title="Functions">
        {expressions.map((expression, index) => (
          <div key={index}>
            <input
              aria-label={`Function ${index + 1}`}
              value={expression}
              onChange={e => updateExpression(index, e.target.value)}
              placeholder="f(x)"
            />
            <button onClick={() => removeExpression(index)} disabled={expressions.length === 1}>Remove</button>
          </div>
        ))}
        <button onClick={addExpression}>Add function</button>
      </Card>

      <Card title="Plot">
        <canvas ref={canvasRef} aria-label="Function plot" aria-describedby="graph-summary" />
<p id="graph-summary">Plotting {expressions.join(', ')} from x={xMin} to x={xMax}.</p>
        {!chartLib && <p>Loading graphing library...</p>}
      </Card>
    </div>
  )
}
