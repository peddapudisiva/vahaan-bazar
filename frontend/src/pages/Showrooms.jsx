import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Showrooms() {
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get('/api/showrooms')
      .then((res) => setShowrooms(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Showrooms</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {showrooms.map((s) => (
            <div key={s.id} className="card">
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className="text-sm text-secondary-600">{s.location}</p>
              <div className="mt-2 text-sm">
                <div className="font-medium">Brands:</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {s.brands.map((b) => (
                    <span key={b} className="rounded bg-secondary-100 px-2 py-0.5 text-secondary-700">{b}</span>
                  ))}
                </div>
              </div>
              {s.phone && <p className="mt-2 text-sm">📞 {s.phone}</p>}
              {s.address && <p className="mt-1 text-sm text-secondary-600">{s.address}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
