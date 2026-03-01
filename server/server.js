require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const Message = require('./models/Message');

// Import routes
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Import passport config
require('./config/googleAuth');

const app = express();

// Connect to database
connectDB();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// 1. Helmet for security headers
app.use(helmet());

// 2. CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Compression middleware
app.use(compression());

// 4. Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 5a. Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// 5b. Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// 6. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // limit registration/login attempts to 50 per 15 minutes
  message: 'Too many attempts, please try again later.',
});

app.use('/api/', limiter);

// 7. Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// ============================================
// STATIC FILES
// ============================================

// Serve uploaded images with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cache-Control', 'public, max-age=31536000');
  next();
});
app.use('/uploads', express.static('uploads'));

// ============================================
// ROUTES
// ============================================

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BookRsell API is running!' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'BookRsell API is running!', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorMiddleware);

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Store active conversations and users
const activeConversations = new Map();

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Join conversation room
  socket.on('join-conversation', (conversationId, userId) => {
    socket.join(conversationId);
    activeConversations.set(conversationId, socket.id);
    console.log(`🟢 User ${userId} joined conversation ${conversationId}`);
    
    // Notify others that user is online NOW
    socket.broadcast.to(conversationId).emit('user-status-changed', { 
      userId, 
      isOnline: true,
      timestamp: new Date()
    });
  });

  // Handle incoming message
  socket.on('send-message', async (data) => {
    // This is now only used for typing indicators
    // Messages are sent via REST API and fetched via polling
    console.log('📤 Message handler called (messages use REST API instead)');
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    socket.broadcast.to(conversationId).emit('user-typing', { userId, isTyping });
  });

  // Mark messages as read
  socket.on('mark-read', async (conversationId) => {
    try {
      await Message.updateMany(
        { conversation: conversationId, isRead: false },
        { isRead: true }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // Leave conversation
  socket.on('leave-conversation', (conversationId, userId) => {
    socket.leave(conversationId);
    activeConversations.delete(conversationId);
    console.log(`🔴 User ${userId} left conversation ${conversationId}`);
    socket.broadcast.to(conversationId).emit('user-status-changed', { 
      userId,
      isOnline: false,
      timestamp: new Date()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 WebSocket (Socket.io) enabled for real-time messaging`);
});
