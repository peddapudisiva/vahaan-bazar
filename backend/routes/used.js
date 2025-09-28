const express = require('express')
const db = require('../config/database')
const { authRequired, rolesAllowed } = require('../middleware/auth')

const router = express.Router()

function parseImages(images) {
  try { return typeof images === 'string' ? JSON.parse(images) : images || [] } catch { return [] }
}

// GET /api/used - list approved used bikes (with basic filters)
router.get('/used', (req, res) => {
  const { q, brand, minPrice, maxPrice, status = 'approved' } = req.query
  const clauses = []
  const params = []
  if (status) { clauses.push('status = ?'); params.push(status) }
  if (brand) { clauses.push('LOWER(brand) = LOWER(?)'); params.push(brand) }
  if (minPrice) { clauses.push('price >= ?'); params.push(Number(minPrice)) }
  if (maxPrice) { clauses.push('price <= ?'); params.push(Number(maxPrice)) }
  if (q) { clauses.push('(LOWER(title) LIKE LOWER(?) OR LOWER(model) LIKE LOWER(?))'); params.push(`%${q}%`, `%${q}%`) }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  db.all(`SELECT * FROM used_bikes ${where} ORDER BY created_at DESC`, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to load used bikes' })
    res.json(rows.map(r => ({ ...r, images: parseImages(r.images) })))
  })
})

// GET /api/used/mine - list current user's listings
router.get('/used/mine', authRequired, (req, res) => {
  db.all(`SELECT * FROM used_bikes WHERE ownerId = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to load listings' })
    res.json(rows.map(r => ({ ...r, images: parseImages(r.images) })))
  })
})

// GET /api/used/:id - detail (approved or owner/admin)
router.get('/used/:id', authRequired, (req, res) => {
  const { id } = req.params
  db.get(`SELECT * FROM used_bikes WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to load listing' })
    if (!row) return res.status(404).json({ error: 'Not found' })
    if (row.status !== 'approved' && !(req.user.role === 'admin' || req.user.id === row.ownerId)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    row.images = parseImages(row.images)
    res.json(row)
  })
})

// Public detail access for approved listing
router.get('/used-public/:id', (req, res) => {
  const { id } = req.params
  db.get(`SELECT * FROM used_bikes WHERE id = ? AND status = 'approved'`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to load listing' })
    if (!row) return res.status(404).json({ error: 'Not found' })
    row.images = parseImages(row.images)
    res.json(row)
  })
})

// POST /api/used - create listing (status pending)
router.post('/used', authRequired, (req, res) => {
  const { title, brand, model, year, price, kms, condition, location, images = [], description } = req.body
  if (!title || !brand || !price) return res.status(400).json({ error: 'title, brand, price required' })
  const stmt = db.prepare(`INSERT INTO used_bikes(title, brand, model, year, price, kms, condition, location, images, description, status, ownerId) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`)
  stmt.run([
    title,
    brand,
    model || null,
    year || null,
    Number(price),
    kms || null,
    condition || null,
    location || null,
    JSON.stringify(images),
    description || null,
    req.user.id,
  ], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to create listing' })
    db.get(`SELECT * FROM used_bikes WHERE id = ?`, [this.lastID], (e2, row) => {
      if (e2) return res.status(500).json({ error: 'Failed to fetch listing' })
      row.images = parseImages(row.images)
      res.status(201).json(row)
    })
  })
})

// PUT /api/used/:id - update (owner only, not sold)
router.put('/used/:id', authRequired, (req, res) => {
  const { id } = req.params
  db.get(`SELECT * FROM used_bikes WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to update' })
    if (!row) return res.status(404).json({ error: 'Not found' })
    if (row.ownerId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    if (row.status === 'sold') return res.status(400).json({ error: 'Cannot update sold listing' })
    const { title, brand, model, year, price, kms, condition, location, images, description, status } = req.body
    db.run(`UPDATE used_bikes SET
      title = COALESCE(?, title),
      brand = COALESCE(?, brand),
      model = COALESCE(?, model),
      year = COALESCE(?, year),
      price = COALESCE(?, price),
      kms = COALESCE(?, kms),
      condition = COALESCE(?, condition),
      location = COALESCE(?, location),
      images = COALESCE(?, images),
      description = COALESCE(?, description),
      status = COALESCE(?, status)
      WHERE id = ?`,
      [title || null, brand || null, model || null, year || null, price || null, kms || null, condition || null, location || null, images ? JSON.stringify(images) : null, description || null, status || null, id],
      (e2) => {
        if (e2) return res.status(500).json({ error: 'Failed to update listing' })
        db.get(`SELECT * FROM used_bikes WHERE id = ?`, [id], (e3, updated) => {
          if (e3) return res.status(500).json({ error: 'Failed to fetch listing' })
          updated.images = parseImages(updated.images)
          res.json(updated)
        })
      }
    )
  })
})

// DELETE /api/used/:id - delete (owner or admin)
router.delete('/used/:id', authRequired, (req, res) => {
  const { id } = req.params
  db.get(`SELECT ownerId FROM used_bikes WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed' })
    if (!row) return res.status(404).json({ error: 'Not found' })
    if (row.ownerId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    db.run(`DELETE FROM used_bikes WHERE id = ?`, [id], (e2) => {
      if (e2) return res.status(500).json({ error: 'Failed to delete' })
      res.json({ success: true })
    })
  })
})

// POST /api/used/:id/approve - approve listing (dealer/admin)
router.post('/used/:id/approve', authRequired, rolesAllowed('dealer','admin'), (req, res) => {
  const { id } = req.params
  db.run(`UPDATE used_bikes SET status = 'approved' WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to approve' })
    res.json({ success: true })
  })
})

// POST /api/used/:id/sold - mark as sold (owner/admin)
router.post('/used/:id/sold', authRequired, (req, res) => {
  const { id } = req.params
  db.get(`SELECT ownerId FROM used_bikes WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed' })
    if (!row) return res.status(404).json({ error: 'Not found' })
    if (row.ownerId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    db.run(`UPDATE used_bikes SET status = 'sold' WHERE id = ?`, [id], (e2) => {
      if (e2) return res.status(500).json({ error: 'Failed to mark sold' })
      res.json({ success: true })
    })
  })
})

module.exports = router
