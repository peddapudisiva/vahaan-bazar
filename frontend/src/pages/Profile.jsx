import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { getAlerts, deleteAlert, getMyUsedOrders } from '../utils/api'

export default function Profile() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [orderStatus, setOrderStatus] = useState('all') // all | pending | confirmed | cancelled | completed

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getAlerts()
        if (mounted) setAlerts(data)
      } catch {
        if (mounted) setAlerts([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadOrders() {
      setLoadingOrders(true)
      try {
        const data = await getMyUsedOrders()
        if (mounted) setOrders(data)
      } catch {
        if (mounted) setOrders([])
      } finally {
        if (mounted) setLoadingOrders(false)
      }
    }
    loadOrders()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="rounded-lg border border-secondary-200 bg-white p-4 dark:border-secondary-800 dark:bg-secondary-900">
        <div className="mb-1 text-sm text-secondary-600 dark:text-secondary-300">Logged in as</div>
        <div className="text-lg font-medium dark:text-white">{user?.name} <span className="ml-2 rounded bg-secondary-100 px-2 py-0.5 text-xs dark:bg-secondary-800 dark:text-secondary-200">{user?.role}</span></div>
        <div className="text-sm text-secondary-600 dark:text-secondary-300">{user?.email}</div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Price Alerts</h2>
        {loading ? (
          <div className="rounded-md border border-secondary-200 bg-white p-4 text-sm text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900">Loading alerts…</div>
        ) : alerts.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-secondary-600">You have no active alerts. Open a bike detail and click "Notify me (10%)" to create one.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map((a) => (
              <div key={a.id} className="rounded-lg border border-secondary-200 bg-white p-3 dark:border-secondary-800 dark:bg-secondary-900">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium dark:text-white">{a.bikeName}</div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-300">Current: ₹{a.currentPrice?.toLocaleString('en-IN')} • Threshold: {a.thresholdPercent}%</div>
                  </div>
                  <button
                    onClick={async () => {
                      setDeletingId(a.id)
                      try {
                        await deleteAlert(a.id)
                        setAlerts((list) => list.filter((x) => x.id !== a.id))
                      } catch {
                        toast.error('Failed to delete alert')
                      } finally {
                        setDeletingId(null)
                      }
                    }}
                    disabled={deletingId === a.id}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                  >
                    {deletingId === a.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Used Orders</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-secondary-600 dark:text-secondary-300">Status</span>
            <select value={orderStatus} onChange={(e)=>setOrderStatus(e.target.value)} className="rounded-md border border-secondary-300 bg-white px-2 py-1 dark:border-secondary-700 dark:bg-secondary-800">
              {['all','pending','confirmed','cancelled','completed'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        {loadingOrders ? (
          <div className="rounded-md border border-secondary-200 bg-white p-4 text-sm text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-secondary-600">No orders yet. Open a used listing and click "Buy / Reserve".</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orders.filter(o => orderStatus==='all' ? true : o.status===orderStatus).map((o) => (
              <div key={o.id} className="rounded-lg border border-secondary-200 bg-white p-3 text-sm dark:border-secondary-800 dark:bg-secondary-900">
                <div className="font-medium dark:text-white">{o.title}</div>
                <div className="text-secondary-600 dark:text-secondary-300">{o.brand} {o.model? `• ${o.model}`:''}</div>
                <div className="flex items-center gap-2 text-xs text-secondary-500">
                  <span>Status:</span>
                  <span className={`rounded px-2 py-0.5 ${o.status==='pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : o.status==='confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : o.status==='completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>{o.status}</span>
                  <span>• Placed: {new Date(o.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-secondary-500">Price at order: ₹{(o.priceAtOrder||0).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
