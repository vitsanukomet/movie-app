const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (สำคัญสำหรับ ALB Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from frontend (production)
// Check multiple possible paths for frontend dist
const possiblePaths = [
  path.join(__dirname, '../dist'),           // When dist is copied to backend/
  path.join(__dirname, '../../frontend/dist') // Development or original location
];

let frontendPath = possiblePaths[0]; // Default
for (const p of possiblePaths) {
  if (require('fs').existsSync(p)) {
    frontendPath = p;
    console.log(`📁 Frontend path found: ${p}`);
    break;
  }
}

app.use(express.static(frontendPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // If it's an API route that wasn't matched, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'API endpoint not found.'
    });
  }
  
  // Otherwise serve the frontend
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).json({
        message: 'Movie App API Server',
        version: '1.0.0',
        endpoints: {
          health: 'GET /health',
          auth: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            me: 'GET /api/auth/me'
          },
          movies: {
            list: 'GET /api/movies',
            detail: 'GET /api/movies/:id'
          },
          admin: {
            movies: 'GET/POST /api/admin/movies',
            movieDetail: 'PUT/DELETE /api/admin/movies/:id',
            users: 'GET /api/admin/users',
            stats: 'GET /api/admin/stats'
          }
        }
      });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.'
  });
});

// Start server
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.warn('⚠️ Starting server without database connection.');
    console.warn('   Make sure to run: npm run db:init');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🎬 =====================================');
    console.log('   Movie App Backend Server');
    console.log('=====================================');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
    console.log('=====================================');
    console.log('');
  });
};

startServer();

