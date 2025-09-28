import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2 text-secondary-600">The page you are looking for might have been removed or is temporarily unavailable.</p>
      <Link to="/" className="btn btn-primary mt-6">Go Home</Link>
    </div>
  )
}
