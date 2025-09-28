const express = require('express')
const db = require('../config/database')
const { authRequired } = require('../middleware/auth')

const router = express.Router()

// GET /api/bikes/:id/reviews - list reviews for a bike with avg
router.get('/bikes/:id/reviews', (req, res) => {
  const { id } = req.params
  db.all(
    `SELECT r.*, u.name as userName FROM reviews r 
     JOIN users u ON u.id = r.userId 
     WHERE r.bikeId = ? ORDER BY r.created_at DESC`,
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch reviews' })
      db.get(
        `SELECT ROUND(AVG(rating), 1) as avgRating, COUNT(*) as count FROM reviews WHERE bikeId = ?`,
        [id],
        (e2, agg) => {
          if (e2) return res.status(500).json({ error: 'Failed to fetch rating' })
          res.json({ reviews: rows, summary: agg || { avgRating: null, count: 0 } })
        }
      )
    }
  )
})

// POST /api/bikes/:id/reviews - add a review (auth)
router.post('/bikes/:id/reviews', authRequired, (req, res) => {
  const { id } = req.params
  const { rating, comment } = req.body
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' })

  // One review per user per bike: delete existing then insert (idempotent behavior)
  db.serialize(() => {
    db.run(`DELETE FROM reviews WHERE bikeId = ? AND userId = ?`, [id, req.user.id], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save review' })
      const stmt = db.prepare(`INSERT INTO reviews(bikeId, userId, rating, comment) VALUES(?, ?, ?, ?)`)
      stmt.run([id, req.user.id, rating, comment || null], function (e2) {
        if (e2) return res.status(500).json({ error: 'Failed to save review' })
        db.get(`SELECT * FROM reviews WHERE id = ?`, [this.lastID], (e3, row) => {
          if (e3) return res.status(500).json({ error: 'Failed to fetch review' })
          res.status(201).json(row)
        })
      })
    })
  })
})

// DELETE /api/reviews/:reviewId - owner or admin
router.delete('/reviews/:reviewId', authRequired, (req, res) => {
  const { reviewId } = req.params
  db.get(`SELECT * FROM reviews WHERE id = ?`, [reviewId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to delete review' })
    if (!row) return res.status(404).json({ error: 'Not found' })
    if (row.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' })
    }
    db.run(`DELETE FROM reviews WHERE id = ?`, [reviewId], (e2) => {
      if (e2) return res.status(500).json({ error: 'Failed to delete review' })
      res.json({ success: true })
    })
  })
})

module.exports = router
