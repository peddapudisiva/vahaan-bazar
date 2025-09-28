import React, { useEffect, useMemo, useState } from 'react'
import { getBikes as apiGetBikes } from '../utils/api'
import { api as axios, getTrending } from '../utils/api'
import Filters from '../components/Filters.jsx'
import BikeCard from '../components/BikeCard.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import Hero from '../components/Hero.jsx'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [brands, setBrands] = useState([])
  const [fuelTypes, setFuelTypes] = useState([])
  const [trending, setTrending] = useState([])

  useEffect(() => {
    axios.get('/api/bikes/brands/list').then((res) => setBrands(res.data))
    axios.get('/api/bikes/fuel-types/list').then((res) => setFuelTypes(res.data))
    getTrending().then(setTrending).catch(()=>setTrending([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { ...filters }
    apiGetBikes(params)
      .then((data) => setBikes(data))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="space-y-4">
      <Hero />
      {trending.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Trending</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((t) => (
              <div key={t.id} className="overflow-hidden rounded-lg border border-secondary-200 bg-white hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900">
                <img src={t.image} alt={t.name} className="h-40 w-full object-cover" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/placeholder-bike.svg'}} />
                <div className="p-3">
                  <div className="font-medium dark:text-white">{t.name}</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-300">{t.brand}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Find Your Two-Wheeler</h1>
          <p className="text-secondary-600">Browse bikes, scooters, and EVs. Compare and book test rides.</p>
        </div>
      </div>

      <Filters onChange={setFilters} brands={brands} fuelTypes={fuelTypes} />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {bikes.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <BikeCard bike={b} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      {!loading && bikes.length === 0 && (
        <div className="col-span-full rounded-lg border border-dashed p-10 text-center text-secondary-600">
          No bikes found. Try adjusting filters.
        </div>
      )}
    </div>
  )
}
