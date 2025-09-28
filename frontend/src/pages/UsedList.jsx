import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getUsed } from '../utils/api'

export default function UsedList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [params, setParams] = useSearchParams()

  const [filters, setFilters] = useState({ q: params.get('q') || '', brand: params.get('brand') || '', minPrice: params.get('minPrice') || '', maxPrice: params.get('maxPrice') || '' })

  useEffect(() => {
    setLoading(true)
    setError('')
    getUsed({ ...filters, status: 'approved' })
      .then(setItems)
      .catch(() => setError('Failed to load used bikes'))
      .finally(() => setLoading(false))
  }, [filters.q, filters.brand, filters.minPrice, filters.maxPrice])

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }))
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Used Bikes</h1>
        <Link to="/used/sell" className="rounded-md bg-primary-600 px-3 py-1.5 text-white hover:bg-primary-700">Sell your bike</Link>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <input placeholder="Search (model/title)" value={filters.q} onChange={(e)=>updateFilter('q', e.target.value)} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
        <input placeholder="Brand" value={filters.brand} onChange={(e)=>updateFilter('brand', e.target.value)} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
        <input placeholder="Min Price" type="number" value={filters.minPrice} onChange={(e)=>updateFilter('minPrice', e.target.value)} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
        <input placeholder="Max Price" type="number" value={filters.maxPrice} onChange={(e)=>updateFilter('maxPrice', e.target.value)} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({length:6}).map((_,i)=> (
            <div key={i} className="h-52 animate-pulse rounded-lg border border-secondary-200 bg-secondary-100 dark:border-secondary-800 dark:bg-secondary-900" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30">{error}</div>
      ) : items.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-secondary-600">No used bikes found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Link key={it.id} to={`/used/${it.id}`} className="overflow-hidden rounded-lg border border-secondary-200 bg-white hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900">
              <img src={it.images?.[0] || '/placeholder-bike.svg'} alt={it.title} className="h-40 w-full object-cover" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/placeholder-bike.svg'}} />
              <div className="p-3">
                <div className="font-medium dark:text-white">{it.title}</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-300">{it.brand} {it.model? `• ${it.model}`:''} {it.year? `• ${it.year}`:''}</div>
                <div className="text-sm font-semibold">₹ {Number(it.price).toLocaleString('en-IN')}</div>
                {it.kms ? <div className="text-xs text-secondary-500">{it.kms} km</div> : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
