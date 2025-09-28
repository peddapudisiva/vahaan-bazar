import React, { createContext, useContext, useEffect, useState } from 'react'

const CompareContext = createContext()

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('vb_compare')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }) // store bike objects (id, name, brand, image, specs, etc.)

  useEffect(() => {
    try {
      localStorage.setItem('vb_compare', JSON.stringify(compareList))
    } catch {}
  }, [compareList])

  const addToCompare = (bike) => {
    setCompareList((prev) => {
      if (prev.find((b) => b.id === bike.id)) return prev
      if (prev.length >= 3) return prev
      return [...prev, bike]
    })
  }

  const removeFromCompare = (id) => setCompareList((prev) => prev.filter((b) => b.id !== id))
  const clearCompare = () => setCompareList([])

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => useContext(CompareContext)
