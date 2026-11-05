import { useState } from 'react'
import { Card, NumberInput } from './UI'
import {
  capacitiveReactance,
  capacitorEnergy,
  chargeFromCurrentTime,
  currentFromChargeTime,
  electricalPower,
  energyCost,
  energyKilowattHours,
  householdEnergyEstimate,
  impedance,
  inductiveReactance,
  inductorEnergy,
  ohmsCurrent,
  ohmsResistance,
  ohmsVoltage,
  parallelCapacitance,
  parallelResistance,
  seriesCapacitance,
  seriesResistance,
  timeFromChargeCurrent,
  transformerVoltage,
} from '../calc'

export function ElectricityCircuitsSection() {
  const [voltage, setVoltage] = useState(12)
  const [current, setCurrent] = useState(3)
  const [resistance, setResistance] = useState(4)

  const [powerW, setPowerW] = useState(1000)
  const [hours, setHours] = useState(2)
  const [tariff, setTariff] = useState(5)
  const [days, setDays] = useState(30)

  const [seriesText, setSeriesText] = useState('2, 3, 4')
  const [parallelText, setParallelText] = useState('2, 3')

  const [charge, setCharge] = useState(10)
  const [time, setTime] = useState(5)

  const [cap, setCap] = useState(0.000001)
  const [capV, setCapV] = useState(10)
  const [ind, setInd] = useState(0.1)
  const [freq, setFreq] = useState(50)

  const [primaryV, setPrimaryV] = useState(230)
  const [np, setNp] = useState(100)
  const [ns, setNs] = useState(50)

  const result = householdEnergyEstimate(powerW, hours, tariff, days)

  return (
    <div className="grid math-grid">
      <Card title="Ohm's law">
        <NumberInput label="Voltage" value={voltage} onChange={setVoltage} suffix="V" />
        <NumberInput label="Current" value={current} onChange={setCurrent} suffix="A" />
        <NumberInput label="Resistance" value={resistance} onChange={setResistance} suffix="Ω" />
        <p>V = I × R = {ohmsVoltage(current, resistance)} V</p>
        <p>I = V / R = {ohmsCurrent(voltage, resistance)} A</p>
        <p>R = V / I = {ohmsResistance(voltage, current)} Ω</p>
        <p>Assumption: ideal DC conductor, constant temperature.</p>
      </Card>

      <Card title="Electrical power">
        <NumberInput label="Voltage" value={voltage} onChange={setVoltage} suffix="V" />
        <NumberInput label="Current" value={current} onChange={setCurrent} suffix="A" />
        <NumberInput label="Resistance" value={resistance} onChange={setResistance} suffix="Ω" />
        <p>P = V × I = {electricalPower(voltage, current)} W</p>
        <p>P = I² × R = {(current * current * resistance)} W</p>
        <p>P = V² / R = {(voltage * voltage / (resistance || 1)).toFixed(4)} W</p>
      </Card>

      <Card title="Household energy estimate">
        <NumberInput label="Wattage" value={powerW} onChange={setPowerW} suffix="W" />
        <NumberInput label="Daily usage" value={hours} onChange={setHours} suffix="h/day" />
        <NumberInput label="Tariff" value={tariff} onChange={setTariff} suffix="per kWh" />
        <NumberInput label="Days" value={days} onChange={setDays} suffix="days" />
        <p>Daily energy: {energyKilowattHours(powerW, hours)} kWh</p>
        <p>Total energy: {result.energyKWh} kWh</p>
        <p>Estimated cost: {result.estimatedCost} (estimate based on entered tariff)</p>
        <p>Energy cost for 2 h at 1000 W: {energyCost(1000, 2, tariff)}</p>
        <p>Assumption: constant wattage, ideal metering, no standby losses.</p>
      </Card>
      <Card title="Series and parallel resistance">
        <input aria-label="Series resistances" value={seriesText} onChange={e => setSeriesText(e.target.value)} placeholder="comma-separated Ω" />
        <input aria-label="Parallel resistances" value={parallelText} onChange={e => setParallelText(e.target.value)} placeholder="comma-separated Ω" />
        <p>Series: {seriesResistance(seriesText)} Ω</p>
        <p>Parallel: {parallelResistance(parallelText)} Ω</p>
        <p>Formula (series): R_eq = R1 + R2 + ...</p>
        <p>Formula (parallel): 1/R_eq = 1/R1 + 1/R2 + ...</p>
      </Card>

      <Card title="Charge and current">
        <NumberInput label="Current" value={current} onChange={setCurrent} suffix="A" />
        <NumberInput label="Time" value={time} onChange={setTime} suffix="s" />
        <NumberInput label="Charge" value={charge} onChange={setCharge} suffix="C" />
        <p>Charge Q = I × t = {chargeFromCurrentTime(current, time)} C</p>
        <p>Current I = Q / t = {currentFromChargeTime(charge, time)} A</p>
        <p>Time t = Q / I = {timeFromChargeCurrent(charge, current)} s</p>
      </Card>

      <Card title="Capacitance and inductance">
        <NumberInput label="Capacitance" value={cap} onChange={setCap} suffix="F" />
        <NumberInput label="Voltage" value={capV} onChange={setCapV} suffix="V" />
        <NumberInput label="Inductance" value={ind} onChange={setInd} suffix="H" />
        <NumberInput label="Frequency" value={freq} onChange={setFreq} suffix="Hz" />
        <p>Capacitor energy = ½ C V² = {capacitorEnergy(cap, capV)} J</p>
        <p>Inductor energy = ½ L I² = {inductorEnergy(ind, current)} J</p>
        <p>Inductive reactance X_L = 2π f L = {inductiveReactance(freq, ind)} Ω</p>
        <p>Capacitive reactance X_C = 1/(2π f C) = {capacitiveReactance(freq, cap)} Ω</p>
        <p>Series RLC impedance = {impedance(resistance, ind, cap, freq)} Ω</p>
        <p>Assumption: ideal components; AC reactance assumes sinusoidal steady state.</p>
      </Card>

      <Card title="Capacitors in series/parallel">
        <input aria-label="Capacitances" value={seriesText} onChange={e => setSeriesText(e.target.value)} placeholder="capacitances in F" />
        <p>Series capacitance: {seriesCapacitance(seriesText.split(',').map(Number))} F</p>
        <p>Parallel capacitance: {parallelCapacitance(seriesText.split(',').map(Number))} F</p>
      </Card>

      <Card title="Transformer">
        <NumberInput label="Primary voltage" value={primaryV} onChange={setPrimaryV} suffix="V" />
        <NumberInput label="Primary turns" value={np} onChange={setNp} suffix="" />
        <NumberInput label="Secondary turns" value={ns} onChange={setNs} suffix="" />
        <p>Secondary voltage = {transformerVoltage(primaryV, np, ns)} V</p>
        <p>Assumption: ideal transformer, no losses.</p>
      </Card>

      <Card title="Method and units">
        <p>All calculations use SI units (V, A, Ω, F, H, Hz, J, W, kWh).</p>
        <p>Household energy cost is an estimate based on the entered tariff and assumes constant power.</p>
        <p>AC reactance and impedance assume sinusoidal steady-state conditions.</p>
      </Card>
    </div>
  )
}

export const ElectricitySection = ElectricityCircuitsSection

