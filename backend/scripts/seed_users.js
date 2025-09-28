const bcrypt = require('bcrypt')
const db = require('../config/database')

async function main() {
  const users = [
    { name: 'Admin', email: 'admin@example.com', password: 'Admin@123', role: 'admin' },
    { name: 'Dealer', email: 'dealer@example.com', password: 'Dealer@123', role: 'dealer' },
    { name: 'User', email: 'user@example.com', password: 'User@123', role: 'user' },
  ]

  await new Promise((resolve) => setTimeout(resolve, 200)) // ensure db ready

  for (const u of users) {
    await new Promise((resolve) => {
      db.get(`SELECT id FROM users WHERE email = ?`, [u.email], async (err, row) => {
        if (err) { console.error('DB error', err); return resolve() }
        if (row) { console.log(`ℹ️  User exists: ${u.email}`); return resolve() }
        const hash = bcrypt.hashSync(u.password, 10)
        const stmt = db.prepare(`INSERT INTO users(name, email, password_hash, role) VALUES(?, ?, ?, ?)`)
        stmt.run([u.name, u.email, hash, u.role], function (e2) {
          if (e2) console.error('Insert error', e2)
          else console.log(`✅ Created ${u.role}: ${u.email}`)
          resolve()
        })
      })
    })
  }

  console.log('🌱 Seed users complete')
  // Close only if your app is not using shared singleton DB; safe to close for script usage
  db.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
