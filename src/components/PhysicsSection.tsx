import { useState } from 'react'
import { Card, NumberInput } from './UI'

export function PhysicsSection() {
  const [mass, setMass] = useState(10)
  const [acc, setAcc] = useState(9.8)
  const [velocity, setVelocity] = useState(20)
  const [time, setTime] = useState(5)

  return (
    <div className="grid">
      <Card title="Mechanics">
        <NumberInput label="Mass" value={mass} onChange={setMass} suffix="kg" />
        <NumberInput label="Acceleration" value={acc} onChange={setAcc} suffix="m/s²" />
        <p>Force: {mass * acc} N</p>
        <p>Kinetic Energy: {0.5 * mass * velocity ** 2} J</p>
      </Card>
      <Card title="Motion">
        <NumberInput label="Velocity" value={velocity} onChange={setVelocity} suffix="m/s" />
        <NumberInput label="Time" value={time} onChange={setTime} suffix="s" />
        <p>Displacement: {velocity * time} m</p>
      </Card>
    </div>
  )
}
