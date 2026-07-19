require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route modules
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware configurations
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy error: Origin not allowed'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Public Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register MVC Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/accounts', accountRoutes);

// Fallback Route for non-existing endpoints
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: 'Server error occurred' });
});


const initializeConnection = async () => {
  try {
    await Promise.all([connectDB()]);
    console.log('All connections established');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}


initializeConnection(); 
