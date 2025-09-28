const express = require('express')
const db = require('../config/database')

const router = express.Router()

// Helper: safe JSON parse
function parseSpecs(specs) {
  try {
    return typeof specs === 'string' ? JSON.parse(specs) : specs || {}
  } catch {
    return {}
  }
}

// GET /api/bikes/:id/recommendations - content-based
router.get('/bikes/:id/recommendations', (req, res) => {
  const { id } = req.params
  db.get(`SELECT * FROM bikes WHERE id = ?`, [id], (err, current) => {
    if (err) return res.status(500).json({ error: 'Failed to load bike' })
    if (!current) return res.status(404).json({ error: 'Bike not found' })

    const curSpecs = parseSpecs(current.specs)
    const curPrice = current.price
    const curBrand = (current.brand || '').toLowerCase()

    db.all(`SELECT * FROM bikes WHERE id != ?`, [id], (e2, rows) => {
      if (e2) return res.status(500).json({ error: 'Failed to load recommendations' })

      const scored = rows.map((b) => {
        const s = parseSpecs(b.specs)
        // Simple similarity: brand match, price proximity, engine/mileage closeness
        let score = 0
        if ((b.brand || '').toLowerCase() === curBrand) score += 2
        const priceDiff = Math.abs((b.price || 0) - (curPrice || 0))
        score += Math.max(0, 2 - priceDiff / 50000) // closer within 100k => up to +2

        const engineDiff = Math.abs((s.engineCC || 0) - (curSpecs.engineCC || 0))
        score += Math.max(0, 1.5 - engineDiff / 50)

        const mileageDiff = Math.abs((s.mileage || 0) - (curSpecs.mileage || 0))
        score += Math.max(0, 1 - mileageDiff / 10)

        return { ...b, specs: s, _score: score }
      })

      scored.sort((a, b) => b._score - a._score)
      res.json(scored.slice(0, 6))
    })
  })
})

// GET /api/recommendations/trending - simple heuristic based on recent bikes
router.get('/recommendations/trending', (req, res) => {
  db.all(`SELECT * FROM bikes ORDER BY created_at DESC LIMIT 6`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to load trending' })
    const items = rows.map((r) => ({ ...r, specs: parseSpecs(r.specs) }))
    res.json(items)
  })
})

module.exports = router
