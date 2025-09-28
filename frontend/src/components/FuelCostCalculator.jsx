import React, { useMemo, useState } from 'react'
import { IndianRupee } from 'lucide-react'
import { formatINR } from '../utils/format.js'

export default function FuelCostCalculator({ mileageOrRange, fuelType }) {
  const [fuelPrice, setFuelPrice] = useState(fuelType === 'Electric' ? 8 : 105) // per unit or per litre
  const [dailyKm, setDailyKm] = useState(20)

  const monthlyCost = useMemo(() => {
    const days = 30
    const totalKm = dailyKm * days
    if (fuelType === 'Electric') {
      // Assume kWh per 100km based on range (approx): energy = 100 / range * battery_kwh, but we don't have battery here.
      // Simple model: cost per km = fuelPrice / (range) * 10 for EV (scaled). Fallback conservative estimate: Rs 0.2 - 0.5 per km.
      const perKm = 0.3 // average cost per km
      return Math.round(perKm * totalKm)
    } else {
      // Petrol scooter/bike: cost per km = fuelPrice / mileage
      const mileage = Number((mileageOrRange || '40').toString().replace(/[^0-9.]/g, '')) || 40
      const perKm = fuelPrice / mileage
      return Math.round(perKm * totalKm)
    }
  }, [fuelPrice, dailyKm, fuelType, mileageOrRange])

  return (
    <div className="card">
      <h3 className="mb-3 text-lg font-semibold">Fuel Cost Calculator</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="label">{fuelType === 'Electric' ? 'Electricity Price (₹/kWh approx.)' : 'Fuel Price (₹/L)'}</label>
          <input className="input" type="number" min="1" step="0.5" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Daily Kilometers</label>
          <input className="input" type="number" min="1" step="1" value={dailyKm} onChange={(e) => setDailyKm(Number(e.target.value))} />
        </div>
        <div className="rounded-lg bg-secondary-50 p-3">
          <div className="text-sm text-secondary-600">Estimated Monthly Cost</div>
          <div className="flex items-center gap-1 text-lg font-semibold">
            <IndianRupee className="h-5 w-5" /> {formatINR(monthlyCost)}
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-secondary-500">Note: This is an estimate based on simplified assumptions and typical usage.</p>
    </div>
  )
}
