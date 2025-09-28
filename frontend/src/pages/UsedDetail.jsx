import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getUsedDetailPublic, getUsedDetail, markUsedSold, createUsedOrder } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function UsedDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState(false)
  const [showBuy, setShowBuy] = useState(false)
  const [buying, setBuying] = useState(false)
  const [buyer, setBuyer] = useState({ name: '', phone: '' })
  const [activeImg, setActiveImg] = useState(0)
  const shareText = useMemo(() => {
    if (!item) return ''
    const title = `${item.title} • ₹${Number(item.price).toLocaleString('en-IN')}`
    const url = typeof window !== 'undefined' ? window.location.href : ''
    return `${title}\n${url}`
  }, [item])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        // Try public endpoint first
        const data = await getUsedDetailPublic(id)
        if (mounted) setItem(data)
      } catch (e) {
        // If logged in, try authenticated detail (for pending/owner)
        if (user) {
          try {
            const data = await getUsedDetail(id)
            if (mounted) setItem(data)
          } catch (err) {
            if (mounted) setError('Failed to load listing')
          }
        } else {
          if (mounted) setError('Listing not available')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id, user])

  if (loading) {
    return <div className="rounded-lg border border-secondary-200 bg-white p-6 text-sm text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900">Loading…</div>
  }

  if (error || !item) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-secondary-600">
        {error || 'Listing not found.'} <Link className="text-primary-600" to="/used">Back to Used</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="space-y-2 md:col-span-3">
          <div className="overflow-hidden rounded-lg border border-secondary-200 dark:border-secondary-800">
            <img
              src={(item.images && item.images[activeImg]) || '/placeholder-bike.svg'}
              alt={item.title}
              className="h-80 w-full object-cover"
              onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/placeholder-bike.svg'}}
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {(item.images && item.images.length ? item.images : ['/placeholder-bike.svg']).slice(0,10).map((src, i) => (
              <button
                type="button"
                key={i}
                className={`overflow-hidden rounded-md border ${activeImg===i? 'border-primary-500' : 'border-secondary-200 dark:border-secondary-800'}`}
                onClick={()=>setActiveImg(i)}
                aria-label={`Image ${i+1}`}
              >
                <img src={src} alt={`${item.title} ${i+1}`} className="h-16 w-full object-cover" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/placeholder-bike.svg'}} />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <h1 className="text-2xl font-semibold dark:text-white">{item.title}</h1>
          <div className="text-secondary-700 dark:text-secondary-300">{item.brand} {item.model? `• ${item.model}`:''} {item.year? `• ${item.year}`:''}</div>
          <div className="text-lg font-semibold">₹ {Number(item.price).toLocaleString('en-IN')}</div>
          {item.kms ? <div className="text-sm text-secondary-600 dark:text-secondary-300">{item.kms} km</div> : null}
          {item.location ? <div className="text-sm text-secondary-600 dark:text-secondary-300">Location: {item.location}</div> : null}
          <div className="text-xs text-secondary-500">Status: {item.status}</div>

          {item.description && (
            <div className="rounded-lg border border-secondary-200 bg-white p-3 text-sm dark:border-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
              {item.description}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Link to="/booking" className="btn btn-primary">Book Test Ride</Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >Share on WhatsApp</a>
            <button
              className="btn btn-outline"
              onClick={async ()=>{
                try {
                  await navigator.clipboard.writeText(shareText)
                  toast.success('Link copied')
                } catch {
                  toast.error('Copy failed')
                }
              }}
            >Copy Link</button>
            {user && item.status === 'approved' && (
              <button className="btn btn-outline" onClick={()=>setShowBuy(v=>!v)}>{showBuy? 'Close' : 'Buy / Reserve'}</button>
            )}
            {user && (
              <button
                className="btn btn-outline"
                disabled={marking}
                onClick={async () => {
                  try {
                    setMarking(true)
                    await markUsedSold(item.id)
                    toast.success('Marked as sold (if owner)')
                    navigate('/used')
                  } catch {
                    toast.error('Failed to mark sold')
                  } finally {
                    setMarking(false)
                  }
                }}
              >{marking ? 'Marking…' : 'Mark as sold'}</button>
            )}
          </div>

          {showBuy && (
            <div className="mt-3 space-y-2 rounded-lg border border-secondary-200 bg-white p-3 text-sm dark:border-secondary-800 dark:bg-secondary-900">
              <div className="text-sm font-medium dark:text-white">Your Details</div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <input placeholder="Your Name" value={buyer.name} onChange={(e)=>setBuyer(b=>({...b,name:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                <input placeholder="Mobile (10 digits)" value={buyer.phone} onChange={(e)=>setBuyer(b=>({...b,phone:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              </div>
              <div className="text-right">
                <button
                  onClick={async ()=>{
                    if (!buyer.name.trim()) { toast.error('Enter your name'); return }
                    if (!/^\d{10}$/.test(buyer.phone)) { toast.error('Enter valid 10-digit phone'); return }
                    setBuying(true)
                    try {
                      await createUsedOrder({ usedId: Number(id), buyerName: buyer.name.trim(), buyerPhone: buyer.phone })
                      toast.success('Order placed! Dealer will contact you')
                      setShowBuy(false)
                      setBuyer({ name: '', phone: '' })
                    } catch (e) {
                      toast.error(e?.response?.data?.error || 'Failed to place order')
                    } finally {
                      setBuying(false)
                    }
                  }}
                  disabled={buying}
                  className="rounded-md bg-primary-600 px-3 py-1.5 text-white hover:bg-primary-700 disabled:opacity-60"
                >{buying? 'Placing…' : 'Confirm Order'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
