import { useState } from 'react'
import { Card, NumberInput } from './UI'
import {
  acceleration,
  centripetalAcceleration,
  centripetalForce,
  density,
  displacement,
  distanceFromAcceleration,
  force,
  gravitationalPotentialEnergy,
  impulse,
  kineticEnergy,
  momentum,
  power,
  pressure,
  speed,
  velocity as velocityCalc,
  work,
} from '../calc'

export function PhysicsSection() {
  const [mass, setMass] = useState(10)
  const [acc, setAcc] = useState(9.8)
  const [velocity, setVelocity] = useState(20)
  const [time, setTime] = useState(5)

  const [initVel, setInitVel] = useState(0)
  const [finalVel, setFinalVel] = useState(15)
  const [kinTime, setKinTime] = useState(2)
  const [distance, setDistance] = useState(100)

  const [massM, setMassM] = useState(2)
  const [velM, setVelM] = useState(3)
  const [forceV, setForceV] = useState(100)
  const [timeI, setTimeI] = useState(2)
  const [distW, setDistW] = useState(4)
  const [angle, setAngle] = useState(0)

  const [massE, setMassE] = useState(2)
  const [velE, setVelE] = useState(3)
  const [height, setHeight] = useState(3)
  const [workV, setWorkV] = useState(100)
  const [timeP, setTimeP] = useState(2)

  const [massD, setMassD] = useState(4)
  const [vol, setVol] = useState(2)
  const [forceP, setForceP] = useState(100)
  const [area, setArea] = useState(2)

  const [massC, setMassC] = useState(2)
  const [velC, setVelC] = useState(4)
  const [radius, setRadius] = useState(2)

  return (
    <div className="grid math-grid">
      <Card title="Mechanics: force and motion">
        <NumberInput label="Mass" value={mass} onChange={setMass} suffix="kg" />
        <NumberInput label="Acceleration" value={acc} onChange={setAcc} suffix="m/s²" />
        <NumberInput label="Velocity" value={velocity} onChange={setVelocity} suffix="m/s" />
        <NumberInput label="Time" value={time} onChange={setTime} suffix="s" />
        <p>Force: {force(mass, acc)} N</p>
        <p>Formula: F = m × a = {mass} × {acc} = {force(mass, acc)} N</p>
        <p>Kinetic Energy: {kineticEnergy(mass, velocity)} J</p>
        <p>Formula: KE = ½ m v² = 0.5 × {mass} × {velocity}² = {kineticEnergy(mass, velocity)} J</p>
        <p>Displacement: {displacement(velocity, time)} m</p>
        <p>Formula: s = v × t = {velocity} × {time} = {displacement(velocity, time)} m</p>
      </Card>

      <Card title="Kinematics">
        <NumberInput label="Initial velocity" value={initVel} onChange={setInitVel} suffix="m/s" />
        <NumberInput label="Final velocity" value={finalVel} onChange={setFinalVel} suffix="m/s" />
        <NumberInput label="Time" value={kinTime} onChange={setKinTime} suffix="s" />
        <p>Acceleration: {acceleration(finalVel, initVel, kinTime)} m/s²</p>
        <p>Formula: a = (v_f − v_i) / t = ({finalVel} − {initVel}) / {kinTime} = {acceleration(finalVel, initVel, kinTime)} m/s²</p>
        <p>Assumption: constant acceleration over the interval.</p>
        <NumberInput label="Distance" value={distance} onChange={setDistance} suffix="m" />
        <p>Speed: {speed(distance, kinTime)} m/s</p>
        <p>Velocity: {velocityCalc(distance, kinTime)} m/s</p>
        <p>Distance from acceleration: {distanceFromAcceleration(initVel, kinTime, acceleration(finalVel, initVel, kinTime))} m</p>
        <p>Assumption: straight-line motion with constant acceleration.</p>
      </Card>
      <Card title="Momentum, impulse and work">
        <NumberInput label="Mass" value={massM} onChange={setMassM} suffix="kg" />
        <NumberInput label="Velocity" value={velM} onChange={setVelM} suffix="m/s" />
        <p>Momentum: {momentum(massM, velM)} kg·m/s</p>
        <p>Formula: p = m × v = {massM} × {velM} = {momentum(massM, velM)} kg·m/s</p>
        <NumberInput label="Force" value={forceV} onChange={setForceV} suffix="N" />
        <NumberInput label="Time" value={timeI} onChange={setTimeI} suffix="s" />
        <p>Impulse: {impulse(forceV, timeI)} N·s</p>
        <p>Formula: J = F × t = {forceV} × {timeI} = {impulse(forceV, timeI)} N·s</p>
        <NumberInput label="Distance" value={distW} onChange={setDistW} suffix="m" />
        <NumberInput label="Angle" value={angle} onChange={setAngle} suffix="deg" />
        <p>Work: {work(forceV, distW, angle)} J</p>
        <p>Formula: W = F × d × cosθ = {forceV} × {distW} × cos({angle}°) = {work(forceV, distW, angle)} J</p>
      </Card>

      <Card title="Energy and power">
        <NumberInput label="Mass" value={massE} onChange={setMassE} suffix="kg" />
        <NumberInput label="Velocity" value={velE} onChange={setVelE} suffix="m/s" />
        <NumberInput label="Height" value={height} onChange={setHeight} suffix="m" />
        <p>KE: {kineticEnergy(massE, velE)} J</p>
        <p>Gravitational PE: {gravitationalPotentialEnergy(massE, height)} J</p>
        <p>Formula: PE = m × g × h = {massE} × 9.8 × {height} = {gravitationalPotentialEnergy(massE, height)} J</p>
        <NumberInput label="Work" value={workV} onChange={setWorkV} suffix="J" />
        <NumberInput label="Time" value={timeP} onChange={setTimeP} suffix="s" />
        <p>Power: {power(workV, timeP)} W</p>
        <p>Formula: P = W / t = {workV} / {timeP} = {power(workV, timeP)} W</p>
        <p>Assumption: idealized conditions, no friction or air resistance.</p>
      </Card>

      <Card title="Density and pressure">
        <NumberInput label="Mass" value={massD} onChange={setMassD} suffix="kg" />
        <NumberInput label="Volume" value={vol} onChange={setVol} suffix="m³" />
        <NumberInput label="Force" value={forceP} onChange={setForceP} suffix="N" />
        <NumberInput label="Area" value={area} onChange={setArea} suffix="m²" />
        <p>Density: {density(massD, vol)} kg/m³</p>
        <p>Formula: ρ = m / V = {massD} / {vol} = {density(massD, vol)} kg/m³</p>
        <p>Pressure: {pressure(forceP, area)} Pa</p>
        <p>Formula: p = F / A = {forceP} / {area} = {pressure(forceP, area)} Pa</p>
      </Card>

      <Card title="Circular motion">
        <NumberInput label="Mass" value={massC} onChange={setMassC} suffix="kg" />
        <NumberInput label="Velocity" value={velC} onChange={setVelC} suffix="m/s" />
        <NumberInput label="Radius" value={radius} onChange={setRadius} suffix="m" />
        <p>Centripetal Force: {centripetalForce(massC, velC, radius)} N</p>
        <p>Formula: F_c = m v² / r = {massC} × {velC}² / {radius} = {centripetalForce(massC, velC, radius)} N</p>
        <p>Centripetal Acceleration: {centripetalAcceleration(velC, radius)} m/s²</p>
        <p>Assumption: uniform circular motion with constant speed.</p>
      </Card>
    </div>
  )
}
