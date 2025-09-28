import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

export default function Filters({ onChange, brands = [], fuelTypes = [] }) {
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange({ search, brand, fuelType, minPrice, maxPrice })
    }, 300)
    return () => clearTimeout(handler)
  }, [search, brand, fuelType, minPrice, maxPrice])

  return (
    <div className="card">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary-500" />
          <input
            className="input pl-10"
            placeholder="Search by name or brand"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="input" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select className="input" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
          <option value="">All Fuel Types</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input className="input" type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input className="input" type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>
    </div>
  )
}
