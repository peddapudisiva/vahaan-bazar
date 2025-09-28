import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { dealerCreateBike, dealerDeleteBike, dealerListBookings, dealerCreateLaunch, dealerDeleteLaunch, dealerUpdateBike, dealerUpdateLaunch } from '../utils/api'
import { getBikes, getLaunches, getUsed, approveUsed, deleteUsed, markUsedSold, dealerListUsedOrders, updateUsedOrderStatus, createUsedOrder } from '../utils/api'

export default function DealerDashboard() {
  const [tab, setTab] = useState('bikes') // bikes | bookings | launches | used | orders

  // Bikes state
  const [bikes, setBikes] = useState([])
  const [bikeForm, setBikeForm] = useState({ name: '', brand: '', price: '', fuelType: 'Petrol', image: '', specs: { engineCC: 150, mileage: 45 } })
  const [savingBike, setSavingBike] = useState(false)
  const [deletingBike, setDeletingBike] = useState(null)
  const [editingBike, setEditingBike] = useState(null) // id
  const [editBikeForm, setEditBikeForm] = useState({ id: null, name: '', brand: '', price: '', fuelType: 'Petrol', image: '', specs: { engineCC: 0, mileage: 0 } })

  // Bookings state
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  // Launches state
  const [launches, setLaunches] = useState([])
  const [launchForm, setLaunchForm] = useState({ name: '', date: '', brand: '', type: 'bike', expectedPrice: '', image: '', description: '' })
  const [savingLaunch, setSavingLaunch] = useState(false)
  const [deletingLaunch, setDeletingLaunch] = useState(null)
  const [editingLaunch, setEditingLaunch] = useState(null)
  const [editLaunchForm, setEditLaunchForm] = useState({ id: null, name: '', date: '', brand: '', type: 'bike', expectedPrice: '', image: '', description: '' })

  // Used listings state
  const [used, setUsed] = useState([])
  const [usedStatusFilter, setUsedStatusFilter] = useState('pending') // pending | approved | sold | all
  const [loadingUsed, setLoadingUsed] = useState(false)
  const [creatingOrderForId, setCreatingOrderForId] = useState(null)
  const [orderBuyer, setOrderBuyer] = useState({ name: '', phone: '' })
  const [placingOrder, setPlacingOrder] = useState(false)

  // Orders state
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [orderFrom, setOrderFrom] = useState('')
  const [orderTo, setOrderTo] = useState('')

  // Loaders
  useEffect(() => {
    getBikes({}).then(setBikes).catch(()=>setBikes([]))
    getLaunches({}).then(setLaunches).catch(()=>setLaunches([]))
  }, [])

  async function refreshBikes() {
    const data = await getBikes({})
    setBikes(data)
  }

  async function loadOrders() {
    setLoadingOrders(true)
    try {
      const data = await dealerListUsedOrders()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  async function refreshLaunches() {
    const data = await getLaunches({})
    setLaunches(data)
  }

  async function loadUsed() {
    setLoadingUsed(true)
    try {
      const params = usedStatusFilter==='all' ? {} : { status: usedStatusFilter }
      const data = await getUsed(params)
      setUsed(data)
    } catch {
      setUsed([])
    } finally {
      setLoadingUsed(false)
    }
  }

  async function loadBookings() {
    setLoadingBookings(true)
    try {
      const data = await dealerListBookings()
      setBookings(data)
    } catch {
      setBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  useEffect(() => {
    if (tab === 'bookings') loadBookings()
    if (tab === 'used') loadUsed()
    if (tab === 'orders') loadOrders()
  }, [tab])

  useEffect(() => {
    if (tab === 'used') loadUsed()
  }, [usedStatusFilter])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dealer Dashboard</h1>

      <div className="flex gap-2">
        {['bikes','bookings','launches','used','orders'].map((t) => (
          <button key={t} onClick={()=>setTab(t)} className={`rounded-md border px-3 py-1.5 text-sm ${tab===t? 'border-primary-500 text-primary-700 bg-primary-50 dark:bg-secondary-800' : 'border-secondary-300 text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab === 'bikes' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-secondary-200 bg-white p-4 dark:border-secondary-800 dark:bg-secondary-900">
            <h2 className="mb-2 text-lg font-medium">Create Bike</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input placeholder="Name" value={bikeForm.name} onChange={(e)=>setBikeForm(f=>({...f,name:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <input placeholder="Brand" value={bikeForm.brand} onChange={(e)=>setBikeForm(f=>({...f,brand:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <input placeholder="Price" type="number" value={bikeForm.price} onChange={(e)=>setBikeForm(f=>({...f,price:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <select value={bikeForm.fuelType} onChange={(e)=>setBikeForm(f=>({...f,fuelType:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800">
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
              </select>
              <input placeholder="Image URL" value={bikeForm.image} onChange={(e)=>setBikeForm(f=>({...f,image:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Engine CC" type="number" value={bikeForm.specs.engineCC} onChange={(e)=>setBikeForm(f=>({
                  ...f, specs: { ...f.specs, engineCC: Number(e.target.value)||0 }
                }))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                <input placeholder="Mileage" type="number" value={bikeForm.specs.mileage} onChange={(e)=>setBikeForm(f=>({
                  ...f, specs: { ...f.specs, mileage: Number(e.target.value)||0 }
                }))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              </div>
            </div>
            <div className="mt-3 text-right">
              <button
                onClick={async ()=>{
                  setSavingBike(true)
                  try {
                    const payload = { ...bikeForm, price: Number(bikeForm.price)||0 }
                    await dealerCreateBike(payload)
                    await refreshBikes()
                    setBikeForm({ name: '', brand: '', price: '', fuelType: 'Petrol', image: '', specs: { engineCC: 150, mileage: 45 } })
                    toast.success('Bike created')
                  } catch {
                    toast.error('Failed to create bike')
                  } finally {
                    setSavingBike(false)
                  }
                }}
                disabled={savingBike}
                className="rounded-md bg-primary-600 px-3 py-1.5 text-white hover:bg-primary-700 disabled:opacity-60"
              >{savingBike? 'Saving…' : 'Create'}</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bikes.map((b)=> (
              <div key={b.id} className="rounded-lg border border-secondary-200 bg-white p-3 dark:border-secondary-800 dark:bg-secondary-900">
                {editingBike === b.id ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium dark:text-white">Edit Bike</div>
                    <input value={editBikeForm.name} onChange={(e)=>setEditBikeForm(f=>({...f,name:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <input value={editBikeForm.brand} onChange={(e)=>setEditBikeForm(f=>({...f,brand:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <input type="number" value={editBikeForm.price} onChange={(e)=>setEditBikeForm(f=>({...f,price:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <select value={editBikeForm.fuelType} onChange={(e)=>setEditBikeForm(f=>({...f,fuelType:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800">
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Electric</option>
                    </select>
                    <input value={editBikeForm.image} onChange={(e)=>setEditBikeForm(f=>({...f,image:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={editBikeForm.specs.engineCC} onChange={(e)=>setEditBikeForm(f=>({...f,specs:{...f.specs,engineCC:Number(e.target.value)||0}}))} className="rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                      <input type="number" value={editBikeForm.specs.mileage} onChange={(e)=>setEditBikeForm(f=>({...f,specs:{...f.specs,mileage:Number(e.target.value)||0}}))} className="rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={()=>setEditingBike(null)} className="rounded-md border border-secondary-300 px-2 py-1 text-xs text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800">Cancel</button>
                      <button onClick={async()=>{
                        try {
                          const payload = {
                            name: editBikeForm.name,
                            brand: editBikeForm.brand,
                            price: Number(editBikeForm.price)||null,
                            fuelType: editBikeForm.fuelType,
                            image: editBikeForm.image,
                            specs: editBikeForm.specs,
                          }
                          await dealerUpdateBike(editBikeForm.id, payload)
                          await refreshBikes()
                          setEditingBike(null)
                        } catch { toast.error('Update failed') }
                      }} className="rounded-md bg-primary-600 px-2 py-1 text-xs text-white hover:bg-primary-700">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium dark:text-white">{b.name}</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-300">{b.brand} • {b.fuelType}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBike(b.id)
                          setEditBikeForm({ id: b.id, name: b.name, brand: b.brand, price: b.price, fuelType: b.fuelType, image: b.image, specs: { engineCC: b.specs?.engineCC || 0, mileage: b.specs?.mileage || 0 } })
                        }}
                        className="rounded-md border border-secondary-300 px-2 py-1 text-xs text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800"
                      >Edit</button>
                      <button
                        onClick={async ()=>{
                          setDeletingBike(b.id)
                          try { await dealerDeleteBike(b.id); await refreshBikes() } catch { toast.error('Delete failed') } finally { setDeletingBike(null) }
                        }}
                        disabled={deletingBike===b.id}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                      >{deletingBike===b.id? 'Deleting…' : 'Delete'}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="space-y-3">
          {loadingBookings ? (
            <div className="rounded-md border border-secondary-200 bg-white p-4 text-sm text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900">Loading bookings…</div>
          ) : bookings.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-secondary-600">No bookings found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((bk)=>(
                <div key={bk.id} className="rounded-lg border border-secondary-200 bg-white p-3 text-sm dark:border-secondary-800 dark:bg-secondary-900">
                  <div className="font-medium dark:text-white">{bk.userName} • {bk.phone}</div>
                  <div className="text-secondary-600 dark:text-secondary-300">{bk.bikeName}</div>
                  <div className="text-secondary-500">{bk.date}</div>
                  <div className="text-secondary-500">{bk.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'launches' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-secondary-200 bg-white p-4 dark:border-secondary-800 dark:bg-secondary-900">
            <h2 className="mb-2 text-lg font-medium">Create Launch</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input placeholder="Name" value={launchForm.name} onChange={(e)=>setLaunchForm(f=>({...f,name:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <input placeholder="Date (YYYY-MM-DD)" value={launchForm.date} onChange={(e)=>setLaunchForm(f=>({...f,date:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <input placeholder="Brand" value={launchForm.brand} onChange={(e)=>setLaunchForm(f=>({...f,brand:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <select value={launchForm.type} onChange={(e)=>setLaunchForm(f=>({...f,type:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800">
                <option value="bike">bike</option>
                <option value="scooter">scooter</option>
                <option value="ev">ev</option>
              </select>
              <input placeholder="Expected Price" type="number" value={launchForm.expectedPrice} onChange={(e)=>setLaunchForm(f=>({...f,expectedPrice:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <input placeholder="Image URL" value={launchForm.image} onChange={(e)=>setLaunchForm(f=>({...f,image:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              <textarea placeholder="Description" value={launchForm.description} onChange={(e)=>setLaunchForm(f=>({...f,description:e.target.value}))} className="md:col-span-2 h-20 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
            </div>
            <div className="mt-3 text-right">
              <button
                onClick={async ()=>{
                  setSavingLaunch(true)
                  try {
                    const payload = { ...launchForm, expectedPrice: launchForm.expectedPrice? Number(launchForm.expectedPrice): null }
                    await dealerCreateLaunch(payload)
                    await refreshLaunches()
                    setLaunchForm({ name: '', date: '', brand: '', type: 'bike', expectedPrice: '', image: '', description: '' })
                    toast.success('Launch created')
                  } catch {
                    toast.error('Failed to create launch')
                  } finally {
                    setSavingLaunch(false)
                  }
                }}
                disabled={savingLaunch}
                className="rounded-md bg-primary-600 px-3 py-1.5 text-white hover:bg-primary-700 disabled:opacity-60"
              >{savingLaunch? 'Saving…' : 'Create'}</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {launches.map((l)=> (
              <div key={l.id} className="rounded-lg border border-secondary-200 bg-white p-3 dark:border-secondary-800 dark:bg-secondary-900">
                {editingLaunch === l.id ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium dark:text-white">Edit Launch</div>
                    <input value={editLaunchForm.name} onChange={(e)=>setEditLaunchForm(f=>({...f,name:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <input value={editLaunchForm.date} onChange={(e)=>setEditLaunchForm(f=>({...f,date:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <input value={editLaunchForm.brand} onChange={(e)=>setEditLaunchForm(f=>({...f,brand:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <select value={editLaunchForm.type} onChange={(e)=>setEditLaunchForm(f=>({...f,type:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800">
                      <option value="bike">bike</option>
                      <option value="scooter">scooter</option>
                      <option value="ev">ev</option>
                    </select>
                    <input type="number" value={editLaunchForm.expectedPrice} onChange={(e)=>setEditLaunchForm(f=>({...f,expectedPrice:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <input value={editLaunchForm.image} onChange={(e)=>setEditLaunchForm(f=>({...f,image:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <textarea value={editLaunchForm.description} onChange={(e)=>setEditLaunchForm(f=>({...f,description:e.target.value}))} className="h-16 w-full rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={()=>setEditingLaunch(null)} className="rounded-md border border-secondary-300 px-2 py-1 text-xs text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800">Cancel</button>
                      <button onClick={async()=>{
                        try {
                          const payload = {
                            name: editLaunchForm.name,
                            date: editLaunchForm.date,
                            brand: editLaunchForm.brand,
                            type: editLaunchForm.type,
                            expectedPrice: editLaunchForm.expectedPrice? Number(editLaunchForm.expectedPrice): null,
                            image: editLaunchForm.image,
                            description: editLaunchForm.description,
                          }
                          await dealerUpdateLaunch(editLaunchForm.id, payload)
                          await refreshLaunches()
                          setEditingLaunch(null)
                        } catch { alert('Update failed') }
                      }} className="rounded-md bg-primary-600 px-2 py-1 text-xs text-white hover:bg-primary-700">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium dark:text-white">{l.name}</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-300">{l.brand} • {l.type} • {l.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingLaunch(l.id)
                          setEditLaunchForm({ id: l.id, name: l.name, date: l.date, brand: l.brand, type: l.type, expectedPrice: l.expectedPrice||'', image: l.image||'', description: l.description||'' })
                        }}
                        className="rounded-md border border-secondary-300 px-2 py-1 text-xs text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800"
                      >Edit</button>
                      <button
                        onClick={async ()=>{
                          setDeletingLaunch(l.id)
                          try { await dealerDeleteLaunch(l.id); await refreshLaunches() } catch { toast.error('Delete failed') } finally { setDeletingLaunch(null) }
                        }}
                        disabled={deletingLaunch===l.id}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                      >{deletingLaunch===l.id? 'Deleting…' : 'Delete'}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'used' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Used Listings</h2>
            <div className="flex items-center gap-2 text-sm">
              <label className="text-secondary-600 dark:text-secondary-300">Status</label>
              <select value={usedStatusFilter} onChange={(e)=>setUsedStatusFilter(e.target.value)} className="rounded-md border border-secondary-300 bg-white px-2 py-1 dark:border-secondary-700 dark:bg-secondary-800">
                <option value="pending">pending</option>
                <option value="approved">approved</option>
                <option value="sold">sold</option>
                <option value="all">all</option>
              </select>
            </div>
          </div>
          {loadingUsed ? (
            <div className="rounded-md border border-secondary-200 bg-white p-4 text-sm text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900">Loading used listings…</div>
          ) : used.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-secondary-600">No listings.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {used.map((u)=> (
                <div key={u.id} className="rounded-lg border border-secondary-200 bg-white p-3 text-sm dark:border-secondary-800 dark:bg-secondary-900">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium dark:text-white">{u.title}</div>
                      <div className="text-secondary-600 dark:text-secondary-300">{u.brand} {u.model? `• ${u.model}`:''} {u.year? `• ${u.year}`:''}</div>
                      <div className="text-xs text-secondary-500">₹ {Number(u.price).toLocaleString('en-IN')} • {u.status}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {u.status === 'pending' && (
                      <button
                        onClick={async ()=>{ try { await approveUsed(u.id); toast.success('Approved'); await loadUsed() } catch { toast.error('Approve failed') } }}
                        className="rounded-md border border-green-300 px-2 py-1 text-xs text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
                      >Approve</button>
                    )}
                    {u.status !== 'sold' && (
                      <button
                        onClick={async ()=>{ try { await markUsedSold(u.id); toast.success('Marked as sold'); await loadUsed() } catch { toast.error('Failed to mark sold') } }}
                        className="rounded-md border border-amber-300 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/30"
                      >Mark Sold</button>
                    )}
                    {u.status === 'approved' && (
                      <button
                        onClick={()=>{
                          setCreatingOrderForId(creatingOrderForId===u.id? null : u.id)
                          setOrderBuyer({ name: '', phone: '' })
                        }}
                        className="rounded-md border border-primary-300 px-2 py-1 text-xs text-primary-700 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-300 dark:hover:bg-secondary-800"
                      >{creatingOrderForId===u.id? 'Close' : 'Create Order'}</button>
                    )}
                    <button
                      onClick={async ()=>{ try { await deleteUsed(u.id); toast.success('Deleted'); await loadUsed() } catch { toast.error('Delete failed') } }}
                      className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                    >Delete</button>
                  </div>
                  {creatingOrderForId===u.id && (
                    <div className="mt-3 space-y-2 rounded-md border border-secondary-200 bg-white p-2 dark:border-secondary-800 dark:bg-secondary-900">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <input placeholder="Buyer Name" value={orderBuyer.name} onChange={(e)=>setOrderBuyer(b=>({...b,name:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                        <input placeholder="Buyer Phone (10 digits)" value={orderBuyer.phone} onChange={(e)=>setOrderBuyer(b=>({...b,phone:e.target.value}))} className="rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
                      </div>
                      <div className="text-right">
                        <button
                          onClick={async ()=>{
                            if (!orderBuyer.name.trim()) { toast.error('Enter buyer name'); return }
                            if (!/^\d{10}$/.test(orderBuyer.phone)) { toast.error('Enter valid 10-digit phone'); return }
                            setPlacingOrder(true)
                            try {
                              await createUsedOrder({ usedId: u.id, buyerName: orderBuyer.name.trim(), buyerPhone: orderBuyer.phone })
                              toast.success('Order created')
                              setCreatingOrderForId(null)
                              setOrderBuyer({ name: '', phone: '' })
                            } catch (e) {
                              toast.error(e?.response?.data?.error || 'Failed to create order')
                            } finally {
                              setPlacingOrder(false)
                            }
                          }}
                          disabled={placingOrder}
                          className="rounded-md bg-primary-600 px-3 py-1.5 text-xs text-white hover:bg-primary-700 disabled:opacity-60"
                        >{placingOrder? 'Creating…' : 'Confirm Order'}</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="block text-xs text-secondary-600 dark:text-secondary-300">From</label>
                <input type="date" value={orderFrom} onChange={(e)=>setOrderFrom(e.target.value)} className="rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              </div>
              <div>
                <label className="block text-xs text-secondary-600 dark:text-secondary-300">To</label>
                <input type="date" value={orderTo} onChange={(e)=>setOrderTo(e.target.value)} className="rounded-md border border-secondary-300 bg-white px-2 py-1 text-sm dark:border-secondary-700 dark:bg-secondary-800" />
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  try {
                    const header = ['Order ID','Used ID','Title','Brand','Model','Buyer Name','Buyer Phone','Status','Price At Order','Created At']
                    const rows = orders.map(o => [o.id, o.usedId, JSON.stringify(o.title||''), JSON.stringify(o.brand||''), JSON.stringify(o.model||''), JSON.stringify(o.buyerName||''), JSON.stringify(o.buyerPhone||''), o.status, o.priceAtOrder||'', o.created_at])
                    const csv = [header.join(','), ...rows.map(r=>r.join(','))].join('\n')
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `used-orders-${new Date().toISOString().slice(0,10)}.csv`
                    a.click()
                    URL.revokeObjectURL(url)
                    toast.success('Exported CSV')
                  } catch { toast.error('Failed to export') }
                }}
                className="rounded-md border border-secondary-300 px-3 py-1.5 text-sm hover:bg-secondary-50 dark:border-secondary-700 dark:hover:bg-secondary-800"
              >Export CSV</button>
            </div>
          </div>
          {loadingOrders ? (
            <div className="rounded-md border border-secondary-200 bg-white p-4 text-sm text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-secondary-600">No orders yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {orders
                .filter((o) => {
                  if (orderFrom && new Date(o.created_at) < new Date(orderFrom)) return false
                  if (orderTo && new Date(o.created_at) > new Date(orderTo + 'T23:59:59')) return false
                  return true
                })
                .map((o) => (
                <div key={o.id} className="rounded-lg border border-secondary-200 bg-white p-3 text-sm dark:border-secondary-800 dark:bg-secondary-900">
                  <div className="font-medium dark:text-white"><a className="hover:underline" href={`/used/${o.usedId}`} target="_blank" rel="noreferrer">{o.title}</a></div>
                  <div className="text-secondary-600 dark:text-secondary-300">{o.brand} {o.model? `• ${o.model}`:''}</div>
                  <div className="text-xs text-secondary-500">Buyer: {o.buyerName} • {o.buyerPhone}</div>
                  <div className="text-xs text-secondary-500">Price at order: ₹{(o.priceAtOrder||0).toLocaleString('en-IN')}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-secondary-500">Status:</span>
                    <select
                      value={o.status}
                      onChange={async (e)=>{
                        const next = e.target.value
                        setUpdatingOrderId(o.id)
                        try { await updateUsedOrderStatus(o.id, next); toast.success('Status updated'); await loadOrders() } catch { toast.error('Failed to update') } finally { setUpdatingOrderId(null) }
                      }}
                      disabled={updatingOrderId===o.id}
                      className="rounded-md border border-secondary-300 bg-white px-2 py-1 text-xs dark:border-secondary-700 dark:bg-secondary-800"
                    >
                      {['pending','confirmed','cancelled','completed'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
