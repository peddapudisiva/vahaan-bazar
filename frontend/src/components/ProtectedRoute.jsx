import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="py-10 text-center text-sm text-secondary-600">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}
