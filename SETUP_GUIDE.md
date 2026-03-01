# BookRsell Installation & Setup Guide

Complete step-by-step guide to get BookRsell running locally.

## 📋 Prerequisites

Before starting, ensure you have:
- [Node.js](https://nodejs.org/) v14 or higher
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)
- Code editor (VS Code recommended)

## ⚙️ System Setup

### 1. Install Node.js & npm

Download from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
```

### 2. Install MongoDB

**Option A: Local MongoDB**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
- Create free cluster
- Get connection string

Verify MongoDB is running:
```bash
mongo --version
```

## 🔧 Backend Setup

### Step 1: Navigate to server folder
```bash
cd BookRsell/server
```

### Step 2: Install dependencies
```bash
npm install
```

This installs:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- multer
- cors
- dotenv

### Step 3: Configure environment variables

Create `.env` file in `server/` folder:

```env
# Server Port
PORT=5000

# MongoDB Connection
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/bookrsell

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookrsell

# JWT Secret (Change this in production!)
JWT_SECRET=bookrsell_super_secret_jwt_key_please_change_this

# Environment
NODE_ENV=development
```

### Step 4: Start MongoDB

**If using local MongoDB:**
```bash
# In another terminal
mongod
```

**If using MongoDB Atlas:**
- Just ensure your connection string is correct in `.env`

### Step 5: Start the server

```bash
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB Connected: localhost or your-atlas-cluster
```

✅ Backend is running at `http://localhost:5000`

## 🎨 Frontend Setup

### Step 1: Open new terminal, navigate to client folder
```bash
cd BookRsell/client
```

### Step 2: Install dependencies
```bash
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- bootstrap
- tailwindcss
- react-icons

### Step 3: Configure environment variables

Create `.env` file in `client/` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start the React app

```bash
npm start
```

This will:
- Open browser automatically to `http://localhost:3000`
- Show hot-reload on file changes
- Display any errors in console

✅ Frontend is running at `http://localhost:3000`

## 🎯 Your First Steps

### 1. Create an Account
- Go to `http://localhost:3000`
- Click "Register"
- Fill in details
- Choose "Seller" role
- Click "Register"

### 2. Add a Book
- Click "Add Book" in navbar
- Fill in book details:
  - Title: "Advanced Java Programming"
  - Author: "Herbert Schildt"
  - Price: 250
  - Category: Engineering
  - Description: "Used once, good condition"
  - City: Delhi
  - Upload an image
- Click "Add Book"

### 3. View Your Listing
- Click "My Ads" in navbar
- See your book listed
- Click Edit to modify or Delete to remove

### 4. Browse Books (as Buyer)
- Go to Home
- Search for books
- Use filters (category, city, price)
- Click on book card to see details
- See seller information

## 📁 Project Structure

```
BookRsell/
├── client/                 # React Frontend (Port 3000)
│   ├── public/
│   ├── src/
│   ├── .env               # Create this
│   └── package.json
│
└── server/                # Express Backend (Port 5000)
    ├── config/db.js
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── uploads/           # Auto-created for images
    ├── .env               # Create this
    └── package.json
```

## 🔐 Testing API Endpoints

Use Postman or curl to test API:

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "city": "Delhi",
    "role": "seller"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Books
```bash
curl -X GET "http://localhost:5000/api/books?category=Engineering&city=Delhi"
```

## 🚨 Common Issues & Solutions

### Issue: "MongoDB connection failed"
```
Solution:
1. Make sure mongod is running
2. Check MONGODB_URI in .env
3. If using Atlas, whitelist your IP in MongoDB Atlas
```

### Issue: "Cannot GET /api/books"
```
Solution:
1. Backend server not running
2. Check port 5000 is not blocked
3. Restart: npm run dev
```

### Issue: "Frontend can't connect to backend"
```
Solution:
1. Check REACT_APP_API_URL in client/.env
2. Make sure backend is running
3. Check CORS is enabled in server.js
4. Restart React app: npm start
```

### Issue: "Image upload failing"
```
Solution:
1. Check uploads/ folder exists in server/
2. File size must be under 5MB
3. Only image formats allowed: JPEG, PNG, GIF
4. Check file upload payload in AddBook.jsx
```

### Issue: "Port already in use"
```
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port - change PORT in .env
```

## 🔄 Development Workflow

### Terminal 1 (Backend)
```bash
cd BookRsell/server
npm run dev
```

### Terminal 2 (Frontend)
```bash
cd BookRsell/client
npm start
```

Now you can:
- Edit React files → Auto-reload on port 3000
- Edit backend files → Auto-reload (nodemon) on port 5000
- See console errors for debugging

## 📦 Build for Production

### Build Frontend
```bash
cd client
npm run build
```

Creates `client/build/` folder ready for deployment

### Prepare Backend
```bash
cd server
# Update .env for production
NODE_ENV=production
MONGODB_URI=your_production_db_url
JWT_SECRET=very_strong_secret_key
```

## 🌐 Deployment

### Deploy Backend to Heroku
```bash
cd server
heroku create bookrsell-backend
git push heroku main
```

### Deploy Frontend to Vercel
```bash
cd client
npm install -g vercel
vercel
```

## 🆘 Getting Help

1. Check error messages in console
2. Look at browser's Network tab
3. Check server logs in terminal
4. Verify all .env files are correctly created
5. Ensure ports 3000 and 5000 are free

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB running locally or Atlas connection ready
- [ ] server/.env file created with correct values
- [ ] client/.env file created with correct values
- [ ] npm install completed for both
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register and login
- [ ] Can add a book
- [ ] Can view books on home page
- [ ] Can search and filter books

## 🎉 You're All Set!

BookRsell is ready to use. Start registering users, adding books, and enjoying the platform!

For detailed information, check:
- `server/README.md` - Backend documentation
- `client/README.md` - Frontend documentation
- `README.md` - Main project documentation

---

Happy coding! 🚀
