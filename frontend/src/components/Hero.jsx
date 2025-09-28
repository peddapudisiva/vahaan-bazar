import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-secondary-200 bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white shadow-md dark:border-secondary-800">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl"
      >
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Trending two-wheelers, test ride today
        </div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          Discover Bikes, Scooters & EVs — Compare, Calculate, and Ride
        </h1>
        <p className="mt-2 text-white/90">
          Explore top models, check EMI, estimate running costs, and book a test ride in minutes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/booking" className="btn btn-primary bg-white text-primary-700 hover:bg-secondary-100">
            Book Test Ride
          </Link>
          <Link to="/compare" className="btn btn-outline border-white/70 bg-transparent text-white hover:bg-white/10">
            Compare Models
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="pointer-events-none absolute -right-8 -top-8 hidden h-40 w-40 rounded-full bg-white/10 blur-xl sm:block"
      />
    </div>
  )
}
