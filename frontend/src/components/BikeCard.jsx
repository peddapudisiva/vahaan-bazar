import React from 'react'
import { Link } from 'react-router-dom'
import { IndianRupee, Fuel, PlusSquare } from 'lucide-react'
import { useCompare } from '../context/CompareContext.jsx'
import { formatINR } from '../utils/format.js'

export default function BikeCard({ bike }) {
  const { addToCompare, compareList } = useCompare()
  const inCompare = compareList.some((b) => b.id === bike.id)

  return (
    <div className="card animate-fade-in transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-secondary-700 dark:bg-secondary-900">
      <Link to={`/bike/${bike.id}`} className="block">
        <img
          src={bike.image}
          alt={bike.name}
          className="h-40 w-full rounded-lg object-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-bike.svg' }}
        />
      </Link>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{bike.name}</h3>
          <span className="inline-flex items-center gap-1 text-sm text-secondary-600">
            <IndianRupee className="h-4 w-4" /> {formatINR(bike.price)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-secondary-600 dark:text-secondary-300">
          <span className="rounded bg-secondary-100 px-2 py-0.5 dark:bg-secondary-800 dark:text-secondary-200">{bike.brand}</span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="h-4 w-4" /> {bike.fuelType}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Link to={`/bike/${bike.id}`} className="btn btn-outline w-full">
            View Details
          </Link>
          <button
            onClick={() => addToCompare(bike)}
            disabled={inCompare || compareList.length >= 3}
            className="btn btn-primary"
            title={inCompare ? 'Already in comparison' : 'Add to compare'}
          >
            <PlusSquare className="mr-1 h-4 w-4" /> Compare
          </button>
        </div>
      </div>
    </div>
  )
}
