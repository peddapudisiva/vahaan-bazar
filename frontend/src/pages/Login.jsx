import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MotionPage from '../components/MotionPage'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MotionPage>
      <div className="mx-auto max-w-md rounded-xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
        <h1 className="mb-4 text-xl font-semibold">Login</h1>
        {error && <div className="mb-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-secondary-700 dark:text-secondary-300">Email</label>
            <input type="email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm outline-none ring-primary-500 focus:ring-2 dark:border-secondary-700 dark:bg-secondary-800" required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-700 dark:text-secondary-300">Password</label>
            <input type="password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} className="w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm outline-none ring-primary-500 focus:ring-2 dark:border-secondary-700 dark:bg-secondary-800" required />
          </div>
          <button disabled={loading} className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-60">{loading ? 'Signing in…' : 'Login'}</button>
        </form>
        <p className="mt-3 text-center text-sm text-secondary-600 dark:text-secondary-300">
          No account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link>
        </p>
        <div className="mt-4 text-xs text-secondary-500">
          Test users: admin@example.com / Admin@123, dealer@example.com / Dealer@123, user@example.com / User@123
        </div>
      </div>
    </MotionPage>
  )
}
