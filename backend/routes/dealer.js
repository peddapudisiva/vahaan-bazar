const express = require('express')
const db = require('../config/database')
const { authRequired, rolesAllowed } = require('../middleware/auth')

const router = express.Router()

// Guard middleware: only dealers or admins
const dealerOnly = [authRequired, rolesAllowed('dealer', 'admin')]

// GET /api/dealer/bookings - view bookings for all bikes (simple view)
router.get('/bookings', dealerOnly, (req, res) => {
  db.all(
    `SELECT bk.*, b.name as bikeName FROM bookings bk
     JOIN bikes b ON b.id = bk.bikeId
     ORDER BY bk.created_at DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch bookings' })
      res.json(rows)
    }
  )
})

// POST /api/dealer/bikes - create a bike
router.post('/bikes', dealerOnly, (req, res) => {
  const { name, brand, price, fuelType, specs, image } = req.body
  if (!name || !brand || !price || !fuelType || !specs || !image) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  const stmt = db.prepare(
    `INSERT INTO bikes(name, brand, price, fuelType, specs, image) VALUES(?, ?, ?, ?, ?, ?)`
  )
  stmt.run([name, brand, price, fuelType, JSON.stringify(specs), image], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to create bike' })
    db.get(`SELECT * FROM bikes WHERE id = ?`, [this.lastID], (e2, row) => {
      if (e2) return res.status(500).json({ error: 'Failed to fetch created bike' })
      row.specs = JSON.parse(row.specs)
      res.status(201).json(row)
    })
  })
})

// PUT /api/dealer/bikes/:id - update a bike
router.put('/bikes/:id', dealerOnly, (req, res) => {
  const { id } = req.params
  const { name, brand, price, fuelType, specs, image } = req.body
  db.run(
    `UPDATE bikes SET name = COALESCE(?, name), brand = COALESCE(?, brand), price = COALESCE(?, price), 
      fuelType = COALESCE(?, fuelType), specs = COALESCE(?, specs), image = COALESCE(?, image) WHERE id = ?`,
    [name || null, brand || null, price || null, fuelType || null, specs ? JSON.stringify(specs) : null, image || null, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update bike' })
      db.get(`SELECT * FROM bikes WHERE id = ?`, [id], (e2, row) => {
        if (e2) return res.status(500).json({ error: 'Failed to fetch updated bike' })
        if (!row) return res.status(404).json({ error: 'Not found' })
        row.specs = JSON.parse(row.specs)
        res.json(row)
      })
    }
  )
})

// DELETE /api/dealer/bikes/:id - delete a bike
router.delete('/bikes/:id', dealerOnly, (req, res) => {
  const { id } = req.params
  db.run(`DELETE FROM bikes WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete bike' })
    res.json({ success: true })
  })
})

// Launches CRUD (basic)
router.post('/launches', dealerOnly, (req, res) => {
  const { name, date, brand, type, expectedPrice, image, description } = req.body
  const stmt = db.prepare(
    `INSERT INTO launches(name, date, brand, type, expectedPrice, image, description) VALUES(?, ?, ?, ?, ?, ?, ?)`
  )
  stmt.run([name, date, brand, type, expectedPrice || null, image || null, description || null], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to create launch' })
    db.get(`SELECT * FROM launches WHERE id = ?`, [this.lastID], (e2, row) => {
      if (e2) return res.status(500).json({ error: 'Failed to fetch launch' })
      res.status(201).json(row)
    })
  })
})

router.put('/launches/:id', dealerOnly, (req, res) => {
  const { id } = req.params
  const { name, date, brand, type, expectedPrice, image, description } = req.body
  db.run(
    `UPDATE launches SET name = COALESCE(?, name), date = COALESCE(?, date), brand = COALESCE(?, brand), type = COALESCE(?, type), expectedPrice = COALESCE(?, expectedPrice), image = COALESCE(?, image), description = COALESCE(?, description) WHERE id = ?`,
    [name || null, date || null, brand || null, type || null, expectedPrice || null, image || null, description || null, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update launch' })
      db.get(`SELECT * FROM launches WHERE id = ?`, [id], (e2, row) => {
        if (e2) return res.status(500).json({ error: 'Failed to fetch updated launch' })
        if (!row) return res.status(404).json({ error: 'Not found' })
        res.json(row)
      })
    }
  )
})

router.delete('/launches/:id', dealerOnly, (req, res) => {
  const { id } = req.params
  db.run(`DELETE FROM launches WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete launch' })
    res.json({ success: true })
  })
})

module.exports = router
