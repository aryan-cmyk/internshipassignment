const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require('./routes/admin');   // <-- Added admin routes
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { startFraudScan } = require('./utils/fraudScheduler');
const otpRoutes = require('./routes/otp');
const requestRoutes = require('./routes/request');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests, try again later'
});

app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);

// Mount admin routes with auth middleware already applied inside admin routes
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('<h2>🚀 Digital Wallet Backend Running</h2><p>Use /api/auth, /api/wallet or /api/admin endpoints.</p>');
});

// Serve frontend if prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

startFraudScan();

app.use('/api/otp', otpRoutes);

app.use('/api/request', requestRoutes);
