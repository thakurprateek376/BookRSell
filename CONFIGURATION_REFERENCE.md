# BookRsell Configuration Reference

Complete guide to all configuration options and settings.

## Environment Variables

### Backend Configuration

#### Required Variables
```env
# Server Port
PORT=5000

# MongoDB Connection String
# Local: mongodb://localhost:27017/bookrsell
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/bookrsell
MONGODB_URI=mongodb://localhost:27017/bookrsell

# JWT Secret Key (Change in production!)
JWT_SECRET=your_very_secure_secret_key_at_least_32_characters

# Environment Mode
NODE_ENV=development  # or production
```

#### Optional Variables
```env
# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Settings
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=uploads
```

### Frontend Configuration

#### Required Variables
```env
# API Base URL
REACT_APP_API_URL=http://localhost:5000/api
```

#### Optional Variables
```env
# For debugging
REACT_APP_DEBUG=false

# App Title
REACT_APP_TITLE=BookRsell
```

## Database Configuration

### MongoDB Connection Options

#### Development (Local MongoDB)
```javascript
MONGODB_URI=mongodb://localhost:27017/bookrsell
```

#### Production (MongoDB Atlas)
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookrsell?retryWrites=true&w=majority
```

### Connection Settings
```javascript
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Add these if needed:
  // connectTimeoutMS: 30000,
  // socketTimeoutMS: 30000,
  // maxPoolSize: 10
}
```

## JWT Configuration

### Token Settings
```javascript
// In authController.js
jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '7d'  // Token validity: 7 days
})

// Change to your needs:
expiresIn: '1d'    // 1 day
expiresIn: '24h'   // 24 hours
expiresIn: '7d'    // 7 days
expiresIn: '30d'   // 30 days
```

## File Upload Configuration

### Multer Settings (server/routes/bookRoutes.js)
```javascript
// Max file size
limits: { fileSize: 5 * 1024 * 1024 }  // 5MB

// Allowed MIME types
const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

// Storage location
destination: (req, file, cb) => cb(null, 'uploads/')

// File naming
filename: (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
}
```

## API Configuration

### CORS Settings (server/server.js)
```javascript
// Default - Allow all origins
app.use(cors());

// Restrictive - Specific origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Server Settings
```javascript
// Body parser limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));
```

## Database Schema Validation

### User Schema
```javascript
{
  name: { required: true, trim: true },
  email: { required: true, unique: true, match: regex },
  password: { required: true, minlength: 6, select: false },
  city: { required: true },
  phone: { default: '' },
  role: { enum: ['buyer', 'seller'], default: 'buyer' }
}
```

### Book Schema
```javascript
{
  title: { required: true, trim: true },
  author: { required: true, trim: true },
  price: { required: true, min: 0 },
  category: { 
    enum: ['Engineering', 'Medical', 'Science', 'Arts', 'Commerce', 'Others'],
    required: true 
  },
  description: { required: true },
  image: { default: null },
  condition: { 
    enum: ['Like New', 'Very Good', 'Good', 'Fair'],
    default: 'Good' 
  },
  city: { required: true },
  seller: { ref: 'User', required: true },
  isActive: { default: true }
}
```

## Frontend Configuration Files

### API Service Configuration (src/services/api.js)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Interceptors for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Bootstrap Configuration (public/index.html)
```html
<!-- Bootstrap CDN -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
```

### Custom Styling Variables (src/styles/main.css)
```css
/* Color Scheme */
--primary: #667eea;
--secondary: #764ba2;
--success: #28a745;
--danger: #dc3545;
--warning: #ffc107;
--info: #17a2b8;

/* Sizing */
--border-radius: 6px;
--box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
```

## Performance Tuning

### MongoDB Optimization
```javascript
// Create Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.books.createIndex({ seller: 1 })
db.books.createIndex({ category: 1 })
db.books.createIndex({ city: 1 })
db.books.createIndex({ title: "text", author: "text" })
```

### Backend Optimization
```javascript
// Pagination
const skip = (page - 1) * limit;
const books = await Book.find(filter)
  .limit(parseInt(limit))
  .skip(skip)
  .sort({ createdAt: -1 });
```

### Frontend Optimization
```javascript
// Lazy Loading
const Home = React.lazy(() => import('./pages/Home'));
const BookDetails = React.lazy(() => import('./pages/BookDetails'));

// Suspense with Fallback
<Suspense fallback={<Loader />}>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Suspense>
```

## Security Configuration

### Password Requirements
- Minimum length: 6 characters
- Hashing algorithm: bcryptjs with salt: 10
- Never return password in API responses

### JWT Best Practices
```
- Token expiration: 7 days
- Secret key: At least 32 characters
- Refresh tokens: Implement for better security
- HTTPS only in production
```

### Input Validation
- Email format validation
- Required field checks
- Price minimum value: 0
- File size limits: 5MB
- Allowed file types: JPEG, PNG, GIF

## Deployment Settings

### Production Environment
```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bookrsell
JWT_SECRET=strong_random_secret_key_32_chars_minimum

# Frontend
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Environment Differences
| Setting | Development | Production |
|---------|-------------|-----------|
| NODE_ENV | development | production |
| Debug Logs | Enabled | Disabled |
| CORS | All Origins | Specific Domain |
| Error Details | Full | Limited |
| Caching | Disabled | Enabled |

## Monitoring & Logging

### Backend Logging
```javascript
// Simple logging
console.log('Info:', message);
console.error('Error:', error);

// For production, consider:
// - Winston
// - Morgan
// - Bunyan
```

### Database Monitoring
```javascript
// Monitor connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB Error:', err);
});
```

## Testing Configuration

### Jest Configuration (Optional)
```json
{
  "testEnvironment": "node",
  "coverageDirectory": "coverage",
  "testMatch": ["**/__tests__/**/*.js"]
}
```

### Example Test
```javascript
const request = require('supertest');
const app = require('../server');

describe('Books API', () => {
  test('GET /api/books should return books', async () => {
    const response = await request(app).get('/api/books');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.books)).toBe(true);
  });
});
```

## Troubleshooting Configuration

### Check Configuration
```bash
# Backend environment
echo $MONGODB_URI
echo $JWT_SECRET
echo $PORT

# Frontend environment  
echo $REACT_APP_API_URL
```

### Verify Settings
```bash
# MongoDB connection
mongo $MONGODB_URI

# Port availability
lsof -i :5000
lsof -i :3000

# Node version
node --version
npm --version
```

---

For more information, refer to:
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [JWT Guide](https://jwt.io/introduction)
