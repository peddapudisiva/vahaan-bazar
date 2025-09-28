import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Launches() {
  const [launches, setLaunches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get('/api/launches')
      .then((res) => setLaunches(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Upcoming Launches</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {launches.map((l) => (
            <div key={l.id} className="card space-y-2">
              {l.image && <img src={l.image} alt={l.name} className="h-40 w-full rounded-lg object-cover" />}
              <h3 className="text-lg font-semibold">{l.name}</h3>
              <p className="text-sm text-secondary-600">{l.brand} • {l.type}</p>
              <p className="text-sm">Launch Date: <span className="font-medium">{new Date(l.date).toDateString()}</span></p>
              {l.expectedPrice && <p className="text-sm">Expected Price: ₹{l.expectedPrice.toLocaleString('en-IN')}</p>}
              {l.description && <p className="text-sm text-secondary-700">{l.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
