import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import EMICalculator from '../components/EMICalculator.jsx'
import FuelCostCalculator from '../components/FuelCostCalculator.jsx'
import { IndianRupee } from 'lucide-react'
import { formatINR } from '../utils/format.js'
import { useCompare } from '../context/CompareContext.jsx'
import { DetailSkeleton } from '../components/Skeleton.jsx'
import { getBike, getReviews, postReview, deleteReview, getRecommendations, createAlert } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function BikeDetail() {
  const { id } = useParams()
  const [bike, setBike] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCompare, compareList } = useCompare()
  const { user } = useAuth()
  const [reviews, setReviews] = useState({ reviews: [], summary: { avgRating: null, count: 0 } })
  const [revForm, setRevForm] = useState({ rating: 5, comment: '' })
  const [savingReview, setSavingReview] = useState(false)
  const [recs, setRecs] = useState([])
  const [alerting, setAlerting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getBike(id)
      .then((data) => setBike(data))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return
    getReviews(id).then(setReviews).catch(() => setReviews({ reviews: [], summary: { avgRating: null, count: 0 } }))
    getRecommendations(id).then(setRecs).catch(() => setRecs([]))
  }, [id])

  if (loading) {
    return <DetailSkeleton />
  }

  if (!bike) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-secondary-600">
        Bike not found. <Link to="/" className="text-primary-600">Go back</Link>
      </div>
    )
  }

  const inCompare = compareList.some((b) => b.id === bike.id)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <img
            src={bike.image}
            alt={bike.name}
            className="h-64 w-full rounded-lg object-cover"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-bike.svg' }}
          />
        </div>
        <div className="md:col-span-3 space-y-3">
          <h1 className="text-2xl font-bold dark:text-white">{bike.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-secondary-700 dark:text-secondary-300">
            <span className="rounded bg-secondary-100 px-2 py-0.5 dark:bg-secondary-800 dark:text-secondary-200">{bike.brand}</span>
            <span className="inline-flex items-center gap-1 text-lg font-semibold">
              <IndianRupee className="h-5 w-5" /> {formatINR(bike.price)}
            </span>
            <span className="rounded bg-secondary-100 px-2 py-0.5 dark:bg-secondary-800 dark:text-secondary-200">{bike.fuelType}</span>
            {reviews.summary.count > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-yellow-50 px-2 py-0.5 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                ⭐ {reviews.summary.avgRating} ({reviews.summary.count})
              </span>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Link to="/booking" state={{ bike }} className="btn btn-primary">Book Test Ride</Link>
            <button onClick={() => addToCompare(bike)} disabled={inCompare} className="btn btn-outline">Add to Compare</button>
            <button
              onClick={async () => {
                if (!user) return alert('Please login to create price alerts')
                setAlerting(true)
                try {
                  await createAlert({ bikeId: bike.id, thresholdPercent: 10 })
                  alert('Price alert created (10% drop). Manage in your profile later.')
                } catch {
                  alert('Failed to create alert')
                } finally {
                  setAlerting(false)
                }
              }}
              disabled={alerting}
              className="btn btn-outline"
            >
              {alerting ? 'Creating…' : 'Notify me (10%)'}
            </button>
          </div>
          <div className="card dark:border-secondary-700 dark:bg-secondary-900">
            <h3 className="mb-2 text-lg font-semibold dark:text-white">Specifications</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(bike.specs).map(([k, v]) => (
                <div key={k} className="flex justify-between rounded border border-secondary-200 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800">
                  <span className="text-secondary-600 dark:text-secondary-300">{k}</span>
                  <span className="font-medium dark:text-white">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EMICalculator price={bike.price} />

      <FuelCostCalculator fuelType={bike.fuelType} mileageOrRange={bike.specs.mileage || bike.specs.range} />

      {/* Recommendations */}
      {recs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">You may also like</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map((r) => (
              <Link key={r.id} to={`/bike/${r.id}`} className="group overflow-hidden rounded-lg border border-secondary-200 bg-white hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900">
                <img src={r.image} alt={r.name} className="h-40 w-full object-cover transition-transform group-hover:scale-[1.02]" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/placeholder-bike.svg'}} />
                <div className="p-3">
                  <div className="font-medium dark:text-white">{r.name}</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-300">{r.brand} • ₹{formatINR(r.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Reviews</h3>
        {user ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setSavingReview(true)
              try {
                await postReview(id, revForm)
                const data = await getReviews(id)
                setReviews(data)
                setRevForm({ rating: 5, comment: '' })
              } catch {
                alert('Failed to save review')
              } finally {
                setSavingReview(false)
              }
            }}
            className="rounded-lg border border-secondary-200 bg-white p-3 dark:border-secondary-800 dark:bg-secondary-900"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm">Your rating:</span>
              {[1,2,3,4,5].map((s) => (
                <button type="button" key={s} onClick={()=>setRevForm(f=>({...f,rating:s}))} className={`text-lg ${revForm.rating >= s ? 'text-yellow-500' : 'text-secondary-400'}`}>★</button>
              ))}
            </div>
            <textarea value={revForm.comment} onChange={(e)=>setRevForm(f=>({...f,comment:e.target.value}))} placeholder="Share your thoughts…" className="h-20 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm outline-none ring-primary-500 focus:ring-2 dark:border-secondary-700 dark:bg-secondary-800" />
            <div className="mt-2 text-right">
              <button disabled={savingReview} className="rounded-md bg-primary-600 px-3 py-1.5 text-white hover:bg-primary-700 disabled:opacity-60">{savingReview ? 'Saving…' : 'Submit review'}</button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg border border-secondary-200 bg-white p-3 text-sm text-secondary-700 dark:border-secondary-800 dark:bg-secondary-900 dark:text-secondary-300">
            Please <Link to="/login" className="text-primary-600 underline">login</Link> to add a review.
          </div>
        )}

        <div className="space-y-2">
          {reviews.reviews.length === 0 && (
            <div className="rounded-md border border-dashed p-4 text-center text-secondary-600">No reviews yet.</div>
          )}
          {reviews.reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-secondary-200 bg-white p-3 dark:border-secondary-800 dark:bg-secondary-900">
              <div className="mb-1 flex items-center justify-between text-sm">
                <div className="font-medium dark:text-white">{r.userName}</div>
                <div className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              </div>
              {r.comment && <div className="text-sm text-secondary-700 dark:text-secondary-300">{r.comment}</div>}
              {user && (user.role === 'admin' || user.id === r.userId) && (
                <div className="mt-2 text-right">
                  <button onClick={async ()=>{ try { await deleteReview(r.id); const data = await getReviews(id); setReviews(data) } catch { alert('Failed to delete')}}} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
