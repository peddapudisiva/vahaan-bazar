import React from 'react'
import { useCompare } from '../context/CompareContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const specKeys = Array.from(new Set(compareList.flatMap((b) => Object.keys(b.specs || {}))))

  if (compareList.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-secondary-600">
        No bikes selected for comparison. Go to Home and add up to 3 bikes.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compare Bikes</h1>
        <button className="btn btn-outline" onClick={clearCompare}>Clear</button>
      </div>

      <div className="overflow-x-auto">
        <motion.table
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full min-w-[700px] border-collapse"
        >
          <thead>
            <tr>
              <th className="border bg-secondary-50 p-3 text-left">Specification</th>
              <AnimatePresence>
                {compareList.map((b) => (
                  <motion.th
                    key={b.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="border bg-secondary-50 p-3 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{b.name}</span>
                      <button className="text-xs text-red-600" onClick={() => removeFromCompare(b.id)}>Remove</button>
                    </div>
                  </motion.th>
                ))}
              </AnimatePresence>
            </tr>
          </thead>
          <tbody>
            {specKeys.map((key) => (
              <motion.tr key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <td className="border p-3 font-medium capitalize">{key}</td>
                <AnimatePresence>
                  {compareList.map((b) => (
                    <motion.td
                      key={b.id + key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="border p-3"
                    >
                      {String((b.specs || {})[key] || '-')}
                    </motion.td>
                  ))}
                </AnimatePresence>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  )
}
