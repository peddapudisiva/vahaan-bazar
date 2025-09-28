const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /api/bookings - Create a new test ride booking
router.post('/', (req, res) => {
  const { userName, phone, bikeId, date } = req.body;

  // Validation
  if (!userName || !phone || !bikeId || !date) {
    return res.status(400).json({ 
      error: 'All fields are required: userName, phone, bikeId, date' 
    });
  }

  // Validate phone number (basic validation)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      error: 'Please enter a valid 10-digit phone number' 
    });
  }

  // Validate date (should be future date)
  const bookingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (bookingDate < today) {
    return res.status(400).json({ 
      error: 'Booking date should be today or a future date' 
    });
  }

  // Check if bike exists
  db.get('SELECT id FROM bikes WHERE id = ?', [bikeId], (err, bike) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to validate bike' });
    }

    if (!bike) {
      return res.status(404).json({ error: 'Bike not found' });
    }

    // Create booking
    const query = `
      INSERT INTO bookings (userName, phone, bikeId, date) 
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [userName, phone, bikeId, date], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create booking' });
      }

      res.status(201).json({
        message: 'Test ride booked successfully!',
        bookingId: this.lastID,
        booking: {
          id: this.lastID,
          userName,
          phone,
          bikeId: parseInt(bikeId),
          date,
          status: 'pending'
        }
      });
    });
  });
});

// GET /api/bookings - Get all bookings (with bike details)
router.get('/', (req, res) => {
  const query = `
    SELECT 
      b.*,
      bikes.name as bikeName,
      bikes.brand as bikeBrand,
      bikes.image as bikeImage
    FROM bookings b
    JOIN bikes ON b.bikeId = bikes.id
    ORDER BY b.created_at DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }

    res.json(rows);
  });
});

// GET /api/bookings/:id - Get specific booking
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      b.*,
      bikes.name as bikeName,
      bikes.brand as bikeBrand,
      bikes.image as bikeImage
    FROM bookings b
    JOIN bikes ON b.bikeId = bikes.id
    WHERE b.id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch booking' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(row);
  });
});

module.exports = router;
