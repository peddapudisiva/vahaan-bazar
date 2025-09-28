const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const bikeRoutes = require('./routes/bikes');
const bookingRoutes = require('./routes/bookings');
const showroomRoutes = require('./routes/showrooms');
const launchRoutes = require('./routes/launches');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const alertRoutes = require('./routes/alerts');
const dealerRoutes = require('./routes/dealer');
const recommendRoutes = require('./routes/recommendations');
const usedRoutes = require('./routes/used');
const usedOrdersRoutes = require('./routes/usedOrders');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CORS_ORIGIN
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true) // allow non-browser tools
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('CORS not allowed for origin: ' + origin), false)
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/bikes', bikeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/showrooms', showroomRoutes);
app.use('/api/launches', launchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', reviewRoutes);
app.use('/api', alertRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api', recommendRoutes);
app.use('/api', usedRoutes);
app.use('/api', usedOrdersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
