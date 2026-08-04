require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Route modules
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// Rate Limiting Configurations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per 15 minutes (protects against brute-force attacks)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts from this IP, please try again after 15 minutes.' },
});

// Apply global rate limiting to all /api routes
app.use('/api', apiLimiter);

// Apply strict rate limiting to authentication routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);


// Wide open on purpose: `origin: true` reflects whatever Origin the request
// came from, so any domain is allowed — this is what actually behaves like
// "*" while staying valid alongside `credentials: true` (the CORS spec
// forbids a literal "*" combined with credentials; browsers just reject it).
// Safe here because auth is a Bearer token in the Authorization header
// (see client/src/utils/api.js), not a cookie — so unlike cookie-based
// auth, a third-party origin can't silently ride along with a signed-in
// user's session. If you ever want to lock this back down to specific
// domains, restore an allowlist check against process.env.CLIENT_URL here.
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser with strict payload size limits to prevent DoS memory exhaustion
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Public Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register MVC Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/feedback', feedbackRoutes);

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
