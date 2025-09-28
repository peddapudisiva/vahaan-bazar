const express = require('express')
const db = require('../config/database')
const { authRequired } = require('../middleware/auth')

const router = express.Router()

// GET /api/alerts - list current user's alerts
router.get('/alerts', authRequired, (req, res) => {
  db.all(
    `SELECT a.*, b.name as bikeName, b.price as currentPrice FROM price_alerts a
     JOIN bikes b ON b.id = a.bikeId
     WHERE a.userId = ? ORDER BY a.created_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch alerts' })
      res.json(rows)
    }
  )
})

// POST /api/alerts - create or update (idempotent on user+bike)
router.post('/alerts', authRequired, (req, res) => {
  const { bikeId, thresholdPercent = 10, active = 1 } = req.body
  if (!bikeId) return res.status(400).json({ error: 'bikeId required' })

  db.serialize(() => {
    db.run(
      `DELETE FROM price_alerts WHERE userId = ? AND bikeId = ?`,
      [req.user.id, bikeId],
      (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save alert' })
        const stmt = db.prepare(
          `INSERT INTO price_alerts(userId, bikeId, thresholdPercent, active) VALUES(?, ?, ?, ?)`
        )
        stmt.run([req.user.id, bikeId, thresholdPercent, active ? 1 : 0], function (e2) {
          if (e2) return res.status(500).json({ error: 'Failed to save alert' })
          db.get(`SELECT * FROM price_alerts WHERE id = ?`, [this.lastID], (e3, row) => {
            if (e3) return res.status(500).json({ error: 'Failed to fetch alert' })
            res.status(201).json(row)
          })
        })
      }
    )
  })
})

// DELETE /api/alerts/:id - delete
router.delete('/alerts/:id', authRequired, (req, res) => {
  const { id } = req.params
  db.run(`DELETE FROM price_alerts WHERE id = ? AND userId = ?`, [id, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete alert' })
    res.json({ success: true })
  })
})

module.exports = router
