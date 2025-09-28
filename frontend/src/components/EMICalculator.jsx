import React, { useMemo, useState } from 'react'
import { IndianRupee } from 'lucide-react'
import { formatINR } from '../utils/format.js'

export default function EMICalculator({ price }) {
  const [downPayment, setDownPayment] = useState(0)
  const [interestRate, setInterestRate] = useState(9.5) // annual interest %
  const [tenure, setTenure] = useState(24) // months

  const principal = Math.max(price - Number(downPayment || 0), 0)
  const monthlyEmi = useMemo(() => {
    const P = principal
    const R = Number(interestRate) / 12 / 100
    const N = Number(tenure)
    if (!P || !R || !N) return 0
    const numerator = P * R * Math.pow(1 + R, N)
    const denominator = Math.pow(1 + R, N) - 1
    return Math.round(numerator / denominator)
  }, [principal, interestRate, tenure])

  const totalPayable = monthlyEmi * tenure + Number(downPayment || 0)

  return (
    <div className="card">
      <h3 className="mb-3 text-lg font-semibold">EMI Calculator</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="label">Down Payment</label>
          <input className="input" type="number" min="0" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
        </div>
        <div>
          <label className="label">Interest Rate (Annual %)</label>
          <input className="input" type="number" min="1" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
        </div>
        <div>
          <label className="label">Tenure (Months)</label>
          <input className="input" type="number" min="3" step="1" value={tenure} onChange={(e) => setTenure(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-secondary-50 p-3">
          <div className="text-sm text-secondary-600">Principal</div>
          <div className="flex items-center gap-1 text-lg font-semibold">
            <IndianRupee className="h-5 w-5" /> {formatINR(principal)}
          </div>
        </div>
        <div className="rounded-lg bg-secondary-50 p-3">
          <div className="text-sm text-secondary-600">Monthly EMI</div>
          <div className="flex items-center gap-1 text-lg font-semibold">
            <IndianRupee className="h-5 w-5" /> {formatINR(monthlyEmi)}
          </div>
        </div>
        <div className="rounded-lg bg-secondary-50 p-3">
          <div className="text-sm text-secondary-600">Total Payable</div>
          <div className="flex items-center gap-1 text-lg font-semibold">
            <IndianRupee className="h-5 w-5" /> {formatINR(totalPayable)}
          </div>
        </div>
      </div>
    </div>
  )
}
