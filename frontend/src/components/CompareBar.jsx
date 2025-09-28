import React from 'react'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext.jsx'

export default function CompareBar() {
  const { compareList, clearCompare, removeFromCompare } = useCompare()

  if (!compareList.length) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 mx-auto max-w-7xl px-4">
      <div className="rounded-xl border border-secondary-300 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-secondary-700 dark:bg-secondary-900/95">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 overflow-x-auto">
            {compareList.map((b) => (
              <div key={b.id} className="flex items-center gap-2 rounded-lg border border-secondary-200 bg-secondary-50 px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800">
                <img src={b.image} alt={b.name} className="h-10 w-16 rounded object-cover" />
                <div className="min-w-[120px]">
                  <div className="font-medium leading-tight">{b.name}</div>
                  <div className="text-xs text-secondary-600 dark:text-secondary-300">{b.brand}</div>
                </div>
                <button onClick={() => removeFromCompare(b.id)} className="text-xs text-red-600">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={clearCompare}>Clear</button>
            <Link to="/compare" className="btn btn-primary">Compare {compareList.length}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
