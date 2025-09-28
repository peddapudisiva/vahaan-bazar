import React, { useEffect, useState } from 'react'
import { createUsed, getMyUsed, deleteUsed } from '../utils/api'

export default function SellUsed() {
  const [form, setForm] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    kms: '',
    condition: 'Good',
    location: '',
    imagesText: '', // comma-separated URLs
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [mine, setMine] = useState([])
  const [loadingMine, setLoadingMine] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  async function loadMine() {
    setLoadingMine(true)
    try {
      const data = await getMyUsed()
      setMine(data)
    } catch {
      setMine([])
    } finally {
      setLoadingMine(false)
    }
  }

  useEffect(() => { loadMine() }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const images = form.imagesText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      const payload = {
        title: form.title,
        brand: form.brand,
        model: form.model || null,
        year: form.year ? Number(form.year) : null,
        price: Number(form.price) || 0,
        kms: form.kms ? Number(form.kms) : null,
        condition: form.condition || null,
        location: form.location || null,
        images,
        description: form.description || null,
      }
      await createUsed(payload)
      alert('Listing submitted. It will be visible after approval.')
      setForm({ title: '', brand: '', model: '', year: '', price: '', kms: '', condition: 'Good', location: '', imagesText: '', description: '' })
      await loadMine()
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to submit listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sell Your Bike</h1>
        <p className="text-sm text-secondary-600 dark:text-secondary-300">Submit details to list your used bike. A dealer/admin will review and approve it.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-lg border border-secondary-200 bg-white p-4 dark:border-secondary-800 dark:bg-secondary-900">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input placeholder="Title (e.g., Pulsar 150, single owner)" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" required />
          <input placeholder="Brand" value={form.brand} onChange={(e)=>setForm(f=>({...f,brand:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" required />
          <input placeholder="Model" value={form.model} onChange={(e)=>setForm(f=>({...f,model:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
          <input placeholder="Year" type="number" value={form.year} onChange={(e)=>setForm(f=>({...f,year:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
          <input placeholder="Price (INR)" type="number" value={form.price} onChange={(e)=>setForm(f=>({...f,price:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" required />
          <input placeholder="Kilometers run" type="number" value={form.kms} onChange={(e)=>setForm(f=>({...f,kms:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
          <select value={form.condition} onChange={(e)=>setForm(f=>({...f,condition:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800">
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
          <input placeholder="Location (City)" value={form.location} onChange={(e)=>setForm(f=>({...f,location:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
          <input placeholder="Image URLs (comma-separated)" value={form.imagesText} onChange={(e)=>setForm(f=>({...f,imagesText:e.target.value}))} className="md:col-span-2 rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
          <textarea placeholder="Description" value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} className="md:col-span-2 h-24 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
        </div>
        <div className="mt-3 text-right">
          <button disabled={submitting} className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-60">{submitting? 'Submitting…' : 'Submit listing'}</button>
        </div>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">My Listings</h2>
        {loadingMine ? (
          <div className="rounded-md border border-secondary-200 bg-white p-4 text-sm text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900">Loading…</div>
        ) : mine.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-secondary-600">You haven’t posted any listings yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((m)=> (
              <div key={m.id} className="rounded-lg border border-secondary-200 bg-white p-3 dark:border-secondary-800 dark:bg-secondary-900">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium dark:text-white">{m.title}</div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-300">{m.brand} {m.model? `• ${m.model}`:''}</div>
                    <div className="text-xs text-secondary-500">Status: {m.status}</div>
                  </div>
                  <button
                    onClick={async ()=>{
                      setDeletingId(m.id)
                      try { await deleteUsed(m.id); await loadMine() } catch { alert('Delete failed') } finally { setDeletingId(null) }
                    }}
                    disabled={deletingId===m.id}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                  >{deletingId===m.id? 'Deleting…' : 'Delete'}</button>
                </div>
                <div className="flex gap-2 text-xs text-secondary-500">
                  <span>₹ {Number(m.price).toLocaleString('en-IN')}</span>
                  {m.kms ? <span>• {m.kms} km</span> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
