import { useState } from 'react'
import { Card, NumberInput } from './UI'
import {
  bernoulliPressure2,
  buoyantForce,
  carnotEfficiency,
  dynamicPressure,
  criticalAngle,
  dopplerFrequency,
  frequencyFromWaveSpeed,
  heatTransfer,
  hydrostaticPressure,
  idealGasPressure,
  lensImageDistance,
  linearThermalExpansion,
  magnification,
  reynoldsNumber,
  snellAngle,
  soundIntensityLevel,
  specificHeat,
  thermalConductionRate,
  volumeFlowRate,
  waveSpeed,
  wavelengthFromWaveSpeed,
} from '../calc'

export function WavesOpticsThermodynamicsFluidsSection() {
  const [freq, setFreq] = useState(10)
  const [lambda, setLambda] = useState(2)
  const [v, setV] = useState(343)
  const [intensity, setIntensity] = useState(1e-6)

  const [focal, setFocal] = useState(10)
  const [doDist, setDoDist] = useState(30)
  const [theta1, setTheta1] = useState(30)
  const [n1, setN1] = useState(1)
  const [n2, setN2] = useState(1.5)

  const [mass, setMass] = useState(2)
  const [sh, setSh] = useState(4184)
  const [dt, setDt] = useState(10)
  const [length0, setLength0] = useState(1)
  const [alpha, setAlpha] = useState(0.000012)
  const [moles, setMoles] = useState(1)
  const [temp, setTemp] = useState(300)
  const [vol, setVol] = useState(0.024)

  const [rho, setRho] = useState(1000)
  const [g, setG] = useState(9.8)
  const [height, setHeight] = useState(2)
  const [area, setArea] = useState(0.01)
  const [vel, setVel] = useState(2)

  const di = lensImageDistance(focal, doDist)
  const mag = magnification(di, doDist)

  return (
    <div className="grid math-grid">
      <Card title="Waves and sound">
        <NumberInput label="Frequency" value={freq} onChange={setFreq} suffix="Hz" />
        <NumberInput label="Wavelength" value={lambda} onChange={setLambda} suffix="m" />
        <NumberInput label="Wave speed" value={v} onChange={setV} suffix="m/s" />
        <p>Wave speed v = f λ = {waveSpeed(freq, lambda)} m/s</p>
        <p>Frequency f = v / λ = {frequencyFromWaveSpeed(v, lambda)} Hz</p>
        <p>Wavelength λ = v / f = {wavelengthFromWaveSpeed(v, freq)} m</p>
        <NumberInput label="Intensity" value={intensity} onChange={setIntensity} suffix="W/m²" />
        <p>Sound level = {soundIntensityLevel(intensity)} dB (reference 1e-12 W/m²)</p>
        <p>Doppler (toward): {dopplerFrequency(freq, v, 10, 5)} Hz</p>
        <p>Assumption: ideal waves in a uniform medium; Doppler assumes constant speeds.</p>
      </Card>

      <Card title="Basic optics">
        <NumberInput label="Focal length" value={focal} onChange={setFocal} suffix="cm" />
        <NumberInput label="Object distance" value={doDist} onChange={setDoDist} suffix="cm" />
        <p>Image distance = {di} cm</p>
        <p>Magnification = {mag}</p>
        <NumberInput label="Theta1" value={theta1} onChange={setTheta1} suffix="deg" />
        <NumberInput label="n1" value={n1} onChange={setN1} suffix="" />
        <NumberInput label="n2" value={n2} onChange={setN2} suffix="" />
        <p>Refracted angle = {snellAngle(theta1, n1, n2)} deg</p>
        <p>Critical angle = {criticalAngle(n2, n1)} deg (if n1&gt;n2)</p>
        <p>Assumption: thin lens/mirror and paraxial rays; ideal surfaces.</p>
      </Card>
      <Card title="Heat and thermodynamics">
        <NumberInput label="Mass" value={mass} onChange={setMass} suffix="kg" />
        <NumberInput label="Specific heat" value={sh} onChange={setSh} suffix="J/kgK" />
        <NumberInput label="ΔT" value={dt} onChange={setDt} suffix="K" />
        <p>Heat Q = m c ΔT = {heatTransfer(mass, sh, dt)} J</p>
        <p>Specific heat c = {specificHeat(heatTransfer(mass, sh, dt), mass, dt)} J/kgK</p>
        <NumberInput label="Initial length" value={length0} onChange={setLength0} suffix="m" />
        <NumberInput label="Alpha" value={alpha} onChange={setAlpha} suffix="1/K" />
        <p>Linear expansion ΔL = {linearThermalExpansion(length0, alpha, dt)} m</p>
        <NumberInput label="Moles" value={moles} onChange={setMoles} suffix="mol" />
        <NumberInput label="Temperature" value={temp} onChange={setTemp} suffix="K" />
        <NumberInput label="Volume" value={vol} onChange={setVol} suffix="m³" />
        <p>Ideal gas pressure P = {idealGasPressure(moles, temp, vol)} Pa</p>
        <p>Carnot efficiency (300K/500K) = {carnotEfficiency(300, 500)}</p>
        <p>Thermal conduction rate = {thermalConductionRate(0.5, 0.01, 10, 0.01)} W</p>
        <p>Assumption: ideal gas, equilibrium states, 1D conduction.</p>
      </Card>

      <Card title="Fluid mechanics">
        <NumberInput label="Density" value={rho} onChange={setRho} suffix="kg/m³" />
        <NumberInput label="Gravity" value={g} onChange={setG} suffix="m/s²" />
        <NumberInput label="Height" value={height} onChange={setHeight} suffix="m" />
        <NumberInput label="Area" value={area} onChange={setArea} suffix="m²" />
        <NumberInput label="Velocity" value={vel} onChange={setVel} suffix="m/s" />
        <p>Hydrostatic pressure = {hydrostaticPressure(rho, g, height)} Pa</p>
        <p>Buoyant force (V=0.01 m³) = {buoyantForce(rho, 0.01, g)} N</p>
        <p>Volume flow rate = {volumeFlowRate(area, vel)} m³/s</p>
        <p>Reynolds number (D=0.05, μ=0.001) = {reynoldsNumber(rho, vel, 0.05, 0.001)}</p>
        <p>Dynamic pressure = {dynamicPressure(rho, vel)} Pa</p>
        <p>Assumption: incompressible, steady, ideal fluid; no viscosity except Reynolds estimate.</p>
      </Card>

      <Card title="Method and assumptions">
        <p>Wave formulas assume linear waves in a uniform medium.</p>
        <p>Optics formulas assume thin lenses/mirrors and paraxial rays.</p>
        <p>Thermodynamics formulas assume ideal gases and equilibrium.</p>
        <p>Fluid formulas assume incompressible, steady flow.</p>
      </Card>
    </div>
  )
}

export const WavesSoundSection = WavesOpticsThermodynamicsFluidsSection
export const OpticsSection = WavesOpticsThermodynamicsFluidsSection
export const ThermodynamicsSection = WavesOpticsThermodynamicsFluidsSection
export const FluidMechanicsSection = WavesOpticsThermodynamicsFluidsSection

