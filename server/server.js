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

const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const chatRoutes = require('./routes/chatRoutes');

require('./config/googleAuth');

const app = express();

connectDB();

app.use(helmet());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(mongoSanitize());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many attempts, please try again later.',
});

app.use('/api/', limiter);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cache-Control', 'public, max-age=31536000');
  next();
});
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BookRsell API is running!' });
});

app.get('/', (req, res) => {
  res.json({ message: 'BookRsell API is running!', version: '1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use(errorMiddleware);

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

const activeConversations = new Map();

io.on('connection', (socket) => {
  socket.on('join-conversation', (conversationId, userId) => {
    socket.join(conversationId);
    activeConversations.set(conversationId, socket.id);
    socket.broadcast.to(conversationId).emit('user-status-changed', { 
      userId, 
      isOnline: true,
      timestamp: new Date()
    });
  });

  socket.on('send-message', async (data) => {
  });

  socket.on('typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    socket.broadcast.to(conversationId).emit('user-typing', { userId, isTyping });
  });

  socket.on('mark-read', async (conversationId) => {
    try {
      await Message.updateMany(
        { conversation: conversationId, isRead: false },
        { isRead: true }
      );
    } catch (error) {
    }
  });

  socket.on('leave-conversation', (conversationId, userId) => {
    socket.leave(conversationId);
    activeConversations.delete(conversationId);
    socket.broadcast.to(conversationId).emit('user-status-changed', { 
      userId,
      isOnline: false,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
  });

  socket.on('error', (error) => {
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
});
