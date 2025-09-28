const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/showrooms - Get all showrooms
router.get('/', (req, res) => {
  const { brand, location } = req.query;
  
  let query = 'SELECT * FROM showrooms WHERE 1=1';
  const params = [];

  if (brand) {
    query += ' AND LOWER(brands) LIKE LOWER(?)';
    params.push(`%${brand}%`);
  }

  if (location) {
    query += ' AND LOWER(location) LIKE LOWER(?)';
    params.push(`%${location}%`);
  }

  query += ' ORDER BY name';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch showrooms' });
    }

    // Parse brands JSON for each showroom
    const showrooms = rows.map(showroom => ({
      ...showroom,
      brands: JSON.parse(showroom.brands)
    }));

    res.json(showrooms);
  });
});

// GET /api/showrooms/:id - Get specific showroom details
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM showrooms WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch showroom details' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Showroom not found' });
    }

    // Parse brands JSON
    const showroom = {
      ...row,
      brands: JSON.parse(row.brands)
    };

    res.json(showroom);
  });
});

module.exports = router;
