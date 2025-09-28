const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/launches - Get all upcoming launches
router.get('/', (req, res) => {
  const { brand, type } = req.query;
  
  let query = 'SELECT * FROM launches WHERE date >= date("now") ';
  const params = [];

  if (brand) {
    query += ' AND LOWER(brand) = LOWER(?)';
    params.push(brand);
  }

  if (type) {
    query += ' AND LOWER(type) = LOWER(?)';
    params.push(type);
  }

  query += ' ORDER BY date ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch launches' });
    }

    res.json(rows);
  });
});

// GET /api/launches/brands/list - Get all unique brands from launches
router.get('/brands/list', (req, res) => {
  db.all('SELECT DISTINCT brand FROM launches ORDER BY brand', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch launch brands' });
    }

    const brands = rows.map(row => row.brand);
    res.json(brands);
  });
});

// GET /api/launches/:id - Get specific launch details
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM launches WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch launch details' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Launch not found' });
    }

    res.json(row);
  });
});

module.exports = router;
