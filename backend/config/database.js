const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.dirname(process.env.DB_PATH || './database/marketplace.db');
const dbPath = process.env.DB_PATH || './database/marketplace.db';

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('📁 Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  // Create bikes table
  db.run(`
    CREATE TABLE IF NOT EXISTS bikes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      price INTEGER NOT NULL,
      fuelType TEXT NOT NULL,
      specs TEXT NOT NULL,
      image TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create bookings table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT NOT NULL,
      phone TEXT NOT NULL,
      bikeId INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bikeId) REFERENCES bikes (id)
    )
  `);

  // Create showrooms table
  db.run(`
    CREATE TABLE IF NOT EXISTS showrooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      brands TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create launches table
  db.run(`
    CREATE TABLE IF NOT EXISTS launches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      brand TEXT NOT NULL,
      type TEXT NOT NULL,
      expectedPrice INTEGER,
      image TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create users table for authentication
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bikeId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bikeId) REFERENCES bikes (id),
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  // Create price alerts table
  db.run(`
    CREATE TABLE IF NOT EXISTS price_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      bikeId INTEGER NOT NULL,
      thresholdPercent INTEGER NOT NULL DEFAULT 10,
      active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bikeId) REFERENCES bikes (id),
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  // Create used_bikes table
  db.run(`
    CREATE TABLE IF NOT EXISTS used_bikes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT,
      year INTEGER,
      price INTEGER NOT NULL,
      kms INTEGER,
      condition TEXT,
      location TEXT,
      images TEXT, -- JSON array of URLs
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | sold
      ownerId INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ownerId) REFERENCES users (id)
    )
  `);

  // Backfill: add contactPhone column if it doesn't exist
  db.get(`PRAGMA table_info(used_bikes)`, [], (e, row) => {
    // Attempt ALTER; ignore error if already exists
    db.run(`ALTER TABLE used_bikes ADD COLUMN contactPhone TEXT`, (err) => {
      // no-op
    })
  })

  // Create used_orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS used_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usedId INTEGER NOT NULL,
      buyerId INTEGER NOT NULL,
      buyerName TEXT,
      buyerPhone TEXT,
      priceAtOrder INTEGER,
      status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled | completed
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usedId) REFERENCES used_bikes (id),
      FOREIGN KEY (buyerId) REFERENCES users (id)
    )
  `);

  console.log('✅ Database tables initialized');
}

module.exports = db;
