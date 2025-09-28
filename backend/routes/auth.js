const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const db = require('../config/database')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'dealer', 'admin'])
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password, role = 'user' } = req.body
    const password_hash = bcrypt.hashSync(password, 10)

    const stmt = db.prepare(`INSERT INTO users(name, email, password_hash, role) VALUES(?, ?, ?, ?)`)
    stmt.run([name, email, password_hash, role], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email already registered' })
        return res.status(500).json({ error: 'Failed to register' })
      }
      const user = { id: this.lastID, name, email, role }
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
      res.json({ user, token })
    })
  }
)

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString()],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) return res.status(500).json({ error: 'Failed to login' })
      if (!row) return res.status(401).json({ error: 'Invalid credentials' })
      const ok = bcrypt.compareSync(password, row.password_hash)
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
      const user = { id: row.id, name: row.name, email: row.email, role: row.role }
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
      res.json({ user, token })
    })
  }
)

router.get('/me', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(200).json({ user: null })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    res.json({ user: payload })
  } catch (e) {
    res.status(200).json({ user: null })
  }
})

module.exports = router
