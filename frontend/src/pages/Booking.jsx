import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { api as axios, getBikes as apiGetBikes, createBooking as apiCreateBooking } from '../utils/api'

export default function Booking() {
  const location = useLocation()
  const preselectedBike = location.state?.bike

  const [bikes, setBikes] = useState([])
  const [form, setForm] = useState({
    userName: '',
    phone: '',
    bikeId: preselectedBike?.id || '',
    date: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    apiGetBikes({}).then((data) => setBikes(data)).catch(() => setBikes([]))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Basic validation
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Please enter a valid 10-digit mobile number')
      setSubmitting(false)
      return
    }
    try {
      const payload = { ...form, bikeId: Number(form.bikeId) }
      await apiCreateBooking(payload)
      toast.success('Test ride booked successfully!')
      setForm({ userName: '', phone: '', bikeId: '', date: '' })
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to book test ride')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Book a Test Ride</h1>
      <form onSubmit={submit} className="card grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="label">Your Name</label>
          <input className="input" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} required />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="10-digit mobile" />
        </div>
        <div>
          <label className="label">Select Bike</label>
          <select className="input" value={form.bikeId} onChange={(e) => setForm({ ...form, bikeId: e.target.value })} required>
            <option value="" disabled>Select a bike</option>
            {bikes.map((b) => (
              <option key={b.id} value={b.id}>{b.name} - {b.brand}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Preferred Date</label>
          <input className="input" type="date" min={new Date().toISOString().slice(0,10)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </div>
        <div className="md:col-span-2">
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Booking...' : 'Book Test Ride'}
          </button>
        </div>
      </form>
    </div>
  )
}
