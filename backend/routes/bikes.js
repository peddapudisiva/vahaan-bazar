const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/bikes - Get all bikes with optional filters
router.get('/', (req, res) => {
  const { brand, fuelType, minPrice, maxPrice, search } = req.query;
  
  let query = 'SELECT * FROM bikes WHERE 1=1';
  const params = [];

  if (brand) {
    query += ' AND LOWER(brand) = LOWER(?)';
    params.push(brand);
  }

  if (fuelType) {
    query += ' AND LOWER(fuelType) = LOWER(?)';
    params.push(fuelType);
  }

  if (minPrice) {
    query += ' AND price >= ?';
    params.push(parseInt(minPrice));
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(parseInt(maxPrice));
  }

  if (search) {
    query += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(brand) LIKE LOWER(?))';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch bikes' });
    }

    // Parse specs JSON for each bike
    const bikes = rows.map(bike => ({
      ...bike,
      specs: JSON.parse(bike.specs)
    }));

    res.json(bikes);
  });
});

// GET /api/bikes/brands/list - Get all unique brands
router.get('/brands/list', (req, res) => {
  db.all('SELECT DISTINCT brand FROM bikes ORDER BY brand', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch brands' });
    }

    const brands = rows.map(row => row.brand);
    res.json(brands);
  });
});

// GET /api/bikes/fuel-types/list - Get all unique fuel types
router.get('/fuel-types/list', (req, res) => {
  db.all('SELECT DISTINCT fuelType FROM bikes ORDER BY fuelType', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch fuel types' });
    }

    const fuelTypes = rows.map(row => row.fuelType);
    res.json(fuelTypes);
  });
});

// GET /api/bikes/:id - Get specific bike details
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM bikes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch bike details' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Bike not found' });
    }

    // Parse specs JSON
    const bike = {
      ...row,
      specs: JSON.parse(row.specs)
    };

    res.json(bike);
  });
});

module.exports = router;
