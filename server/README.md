# BookRsell Backend API

Express.js backend for BookRsell - Second-hand Book Marketplace

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookrsell
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

### Run Development Server
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

## 📁 Folder Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── bookController.js     # Book operations
│   └── userController.js     # User profile
├── models/
│   ├── User.js               # User schema
│   └── Book.js               # Book schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── bookRoutes.js         # Book endpoints
│   └── userRoutes.js         # User endpoints
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── errorMiddleware.js    # Error handling
├── uploads/                  # Uploaded images
├── server.js                 # Main server
└── package.json
```

## 📚 API Endpoints

### POST /api/auth/register
Register new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "city": "Delhi",
  "role": "seller"
}
```

### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: `{ token, user: { id, name, email, city, role } }`

### GET /api/books
Get all books with filters
```
Query Parameters:
- category: Engineering, Medical, Science, Arts, Commerce, Others
- city: City name
- minPrice: Minimum price
- maxPrice: Maximum price
- search: Search by title or author
- page: Page number (default: 1)
- limit: Books per page (default: 10)
```

### GET /api/books/:id
Get single book details

### POST /api/books (Protected)
Add new book
```
Form Data:
- title (required)
- author (required)
- price (required)
- category (required)
- description (required)
- city (required)
- condition: Like New, Very Good, Good, Fair
- image: File upload
```

### PUT /api/books/:id (Protected)
Update book

### DELETE /api/books/:id (Protected)
Delete book

### GET /api/books/seller/myads (Protected)
Get seller's books

### GET /api/users/profile (Protected)
Get user profile

### PUT /api/users/profile (Protected)
Update user profile
```json
{
  "name": "John Doe",
  "city": "Mumbai",
  "phone": "9876543210"
}
```

### GET /api/users/:id
Get seller information

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File upload
- **cors** - CORS handling
- **dotenv** - Environment variables
- **express-validator** - Input validation

## 🔧 Configuration

### Multer Image Upload
- Location: `server/uploads/`
- Max size: 5MB
- Allowed types: JPEG, PNG, GIF

### MongoDB Connection
- Default: `mongodb://localhost:27017/bookrsell`
- Use MongoDB Atlas for cloud: `mongodb+srv://user:pass@cluster.mongodb.net/bookrsell`

## 🚨 Error Handling

All errors return standardized response:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 📝 Middleware

### authMiddleware
- Verifies JWT token
- Sets `req.userId` for protected routes

### errorMiddleware
- Catches and formats all errors
- Returns consistent error responses

## 🔄 Data Flow

1. Client sends request with JWT token
2. authMiddleware verifies token
3. Controller processes request
4. MongoDB returns/updates data
5. Response sent back to client

## 🎯 Controller Functions

### authController
- `register()` - Create new user
- `login()` - Authenticate user

### bookController
- `getBooks()` - Fetch all books with filters
- `getBook()` - Get single book
- `addBook()` - Add new book
- `updateBook()` - Update book
- `deleteBook()` - Delete book
- `getSellerBooks()` - Get seller's listings

### userController
- `getProfile()` - Get user profile
- `updateProfile()` - Update profile
- `getSellerInfo()` - Get seller details

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  city: String,
  phone: String,
  role: 'buyer' | 'seller',
  timestamps
}
```

### Book
```javascript
{
  title: String,
  author: String,
  price: Number,
  category: String,
  description: String,
  image: String,
  condition: 'Like New' | 'Very Good' | 'Good' | 'Fair',
  city: String,
  seller: ObjectId (ref: User),
  isActive: Boolean,
  timestamps
}
```

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET=your_secret
heroku addons:create mongolab
```

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bookrsell
JWT_SECRET=strong_random_secret_key
NODE_ENV=production
```

## 🆘 Troubleshooting

**MongoDB Connection Failed**
- Check if mongod is running
- Verify MONGODB_URI in .env
- Check firewall/network access

**JWT Token Invalid**
- Ensure JWT_SECRET matches frontend
- Check token format in Authorization header
- Token may be expired (7 days)

**Image Upload Failed**
- Verify uploads folder exists
- Check file size (max 5MB)
- Ensure proper image format

---

Built with ❤️ for BookRsell
