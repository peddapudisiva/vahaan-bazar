const express = require('express')
const db = require('../config/database')
const { authRequired, rolesAllowed } = require('../middleware/auth')

const router = express.Router()

// Create an order (Buy/Reserve) - auth
// POST /api/used-orders
router.post('/used-orders', authRequired, (req, res) => {
  const { usedId, buyerName, buyerPhone } = req.body
  if (!usedId || !buyerName || !buyerPhone) return res.status(400).json({ error: 'usedId, buyerName, buyerPhone required' })

  db.get(`SELECT id, price, status FROM used_bikes WHERE id = ?`, [usedId], (err, used) => {
    if (err) return res.status(500).json({ error: 'Failed to create order' })
    if (!used) return res.status(404).json({ error: 'Listing not found' })
    if (used.status !== 'approved') return res.status(400).json({ error: 'Listing not available for order' })

    const stmt = db.prepare(`
      INSERT INTO used_orders (usedId, buyerId, buyerName, buyerPhone, priceAtOrder, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `)
    stmt.run([usedId, req.user.id, buyerName, buyerPhone, used.price], function (e2) {
      if (e2) return res.status(500).json({ error: 'Failed to place order' })
      const orderId = this.lastID
      // Notify seller (placeholder): fetch owner email and log
      db.get(`SELECT u.email as sellerEmail, u.name as sellerName FROM used_bikes ub JOIN users u ON u.id = ub.ownerId WHERE ub.id = ?`, [usedId], (eN, seller) => {
        if (!eN && seller) {
          console.log(`📣 Notify seller ${seller.sellerName} <${seller.sellerEmail}>: New order placed for listing #${usedId} by ${buyerName} (${buyerPhone}).`)
        }
      })
      db.get(`SELECT * FROM used_orders WHERE id = ?`, [orderId], (e3, row) => {
        if (e3) return res.status(500).json({ error: 'Failed to fetch order' })
        res.status(201).json(row)
      })
    })
  })
})

// List my orders - auth
// GET /api/used-orders/mine
router.get('/used-orders/mine', authRequired, (req, res) => {
  db.all(`SELECT o.*, u.title, u.brand, u.model FROM used_orders o JOIN used_bikes u ON u.id = o.usedId WHERE o.buyerId = ? ORDER BY o.created_at DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to load orders' })
    res.json(rows)
  })
})

// Dealer/Admin list of orders for managed listings (ownerId) - dealer/admin
// GET /api/used-orders/dealer
router.get('/used-orders/dealer', authRequired, rolesAllowed('dealer','admin'), (req, res) => {
  db.all(`
    SELECT o.*, u.title, u.brand, u.model, u.ownerId
    FROM used_orders o
    JOIN used_bikes u ON u.id = o.usedId
    ORDER BY o.created_at DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to load orders' })
    res.json(rows)
  })
})

// Update order status - dealer/admin
// POST /api/used-orders/:id/status { status }
router.post('/used-orders/:id/status', authRequired, rolesAllowed('dealer','admin'), (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const allowed = ['pending','confirmed','cancelled','completed']
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  db.run(`UPDATE used_orders SET status = ? WHERE id = ?`, [status, id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update order' })
    res.json({ success: true })
  })
})

module.exports = router
