import React from 'react'

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-secondary-200/60 dark:bg-secondary-800 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="card">
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="md:col-span-3 space-y-3">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-40" />
          <div className="card space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}
