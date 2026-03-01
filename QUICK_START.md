# 🚀 BookRsell - Quick Start Guide

## ⚡ Get Started in 2 Minutes

### Prerequisites
- ✅ Node.js installed
- ✅ MongoDB running locally
- ✅ Terminal/PowerShell access

---

## 🎯 Quick Start Commands

### Option 1: Running Everything (Recommended)

#### Terminal 1 - Backend Server
```powershell
cd e:\BookRsell\server
npm run dev
```

**Expected Output:**
```
🚀 Server is running on port 5000
📊 Environment: development
MongoDB Connected: localhost
```

---

#### Terminal 2 - Frontend Server
```powershell
cd e:\BookRsell\client
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3001
```

---

## 📱 Access the Application

```
🌐 Frontend:  http://localhost:3001
🔌 Backend:   http://localhost:5000
✅ Health:    http://localhost:5000/health
```

---

## 🧪 Test the Features

### 1️⃣ Create Test Account
1. Go to http://localhost:3001
2. Click "Register"
3. Create account with:
   - Name: `John Seller`
   - Email: `seller@test.com`
   - Password: `Test@123`
   - City: `Karachi`
   - Role: `Seller`

### 2️⃣ List a Test Book
1. Login with seller account
2. Click "Add Book"
3. Fill in:
   - Title: `The Great Gatsby`
   - Author: `F. Scott Fitzgerald`
   - Price: `500`
   - Category: `Fiction`
   - Description: `Classic American novel`
   - Condition: `Good`
4. Click "Upload Book"

### 3️⃣ Create Buyer Account
1. Logout from seller account
2. Register new account:
   - Name: `Jane Buyer`
   - Email: `buyer@test.com`
   - Password: `Test@123`
   - City: `Lahore`
   - Role: `Buyer`

### 4️⃣ Test Inquiry System
1. Login as buyer
2. Find the book from seller
3. Click "Send Inquiry"
4. Enter:
   - Message: `Is this available? Can you deliver?`
   - Price: `450`
5. Click "Send Inquiry"
6. Go to "My Inquiries" → "Books I'm Interested In"
7. See your inquiry with "pending" status

### 5️⃣ Test Seller Response
1. Login as seller
2. Go to "My Inquiries" → "Inquiries Received"
3. See buyer's inquiry
4. Click "Accept" / "Reject" / "Mark as Sold"

### 6️⃣ Test Review System
1. As buyer, go to book details
2. Scroll to "Reviews"
3. Click "Write a Review"
4. Select 5 stars
5. Write: `Excellent condition, great deal!`
6. Click "Submit Review"
7. See review appear in the list with average rating

### 7️⃣ Test Wishlist
1. As buyer, click "Save" (heart icon) on any book
2. Go to "Wishlist" in navbar
3. See saved book in wishlist
4. Click "Remove from Wishlist" to remove

---

## 🔍 Watch the Magic Happen

As you test, open browser Developer Tools (F12) to see:
- **Network tab**: All API calls to backend
- **Console tab**: Any errors or logs
- **Storage tab**: JWT token in localStorage

---

## 🛠️ Troubleshooting

### Backend Error: "Cannot find module"
```powershell
cd e:\BookRsell\server
npm install
npm run dev
```

### Frontend Error: "Port already in use"
```powershell
# Change port in package.json or kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F
npm start
```

### MongoDB Connection Error
```powershell
# Ensure MongoDB is running
# On Windows:
mongod --dbpath "C:\data\db"

# Or use MongoDB Compass GUI app
```

### API Returns 401 Unauthorized
- Check if token exists in localStorage
- Clear browser cache and login again
- Check .env JWT_SECRET is set

---

## 📊 API Testing (Optional)

Use Postman or Thunder Client to test:

### Register User
```
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123",
  "city": "Karachi",
  "role": "buyer"
}
```

### Login User
```
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

### Send Inquiry (with token)
```
POST http://localhost:5000/api/inquiries/create/BOOK_ID
Authorization: Bearer YOUR_TOKEN
{
  "message": "Is this available?",
  "offeredPrice": 450
}
```

### Leave Review (with token)
```
POST http://localhost:5000/api/reviews/create/BOOK_ID
Authorization: Bearer YOUR_TOKEN
{
  "rating": 5,
  "comment": "Great book!"
}
```

---

## 🎨 Testing New Features

### Feature Matrix

| Feature | Page | Test Steps |
|---------|------|------------|
| **Inquiry** | Book Details | Click "Send Inquiry" |
| **Review** | Book Details | Scroll to "Reviews" section |
| **Wishlist** | Any Book | Click "Save" button |
| **My Inquiries** | Nav Bar | Click "Inquiries" link |
| **Wishlist Page** | Nav Bar | Click "Wishlist" link |

---

## 📈 Performance Monitoring

Check server performance:

### Backend Health
```
GET http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "BookRsell API is running!"
}
```

### Network Performance
- Open DevTools (F12)
- Go to Network tab
- Refresh page
- Sort by size/time
- API calls should be <200ms

---

## 🔐 Security Testing

### Test Rate Limiting
```powershell
# Try 6 login attempts in quick succession
# 6th attempt should get 429 Too Many Requests
```

### Test Validation
```
Register with invalid email: test@invalid
Result: Should fail validation

Register with password: test
Result: Should fail (6+ chars required)

Send inquiry with empty message
Result: Should fail validation
```

### Test Authentication
```
Try accessing /my-inquiries without login
Result: Should redirect to login page

Call API without Bearer token
Result: Should get 401 Unauthorized
```

---

## 🎯 Success Indicators

✅ You'll know everything is working when:

```
✅ Backend outputs: "🚀 Server is running on port 5000"
✅ Frontend shows: "Compiled successfully!"
✅ Browser loads http://localhost:3001 without errors
✅ Can register new account
✅ Can list books
✅ Can send inquiries with custom prices
✅ Can leave 5-star reviews
✅ Can save books to wishlist
✅ Can view all saved books
✅ Sellers can manage inquiries (accept/reject/sold)
✅ Reviews show average rating
✅ All pages are responsive on mobile
```

---

## 📱 Mobile Testing

Test responsive design:

1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select iPhone 12 / iPad
4. Verify:
   - Navbar collapses to hamburger menu
   - Cards stack vertically
   - Buttons are touch-sized (48px)
   - Forms are readable
   - Images scale properly

---

## 🧪 Automated Testing (Optional)

You can add Jest/Testing Library later:

```powershell
npm install --save-dev @testing-library/react jest

# Create test file
echo "" > src/components/__tests__/WishlistButton.test.js

# Run tests
npm test
```

---

## 📊 Database Verification

Open MongoDB Compass and verify:

1. Database: `bookrsell`
2. Collections:
   - `users` - User accounts
   - `books` - Book listings
   - `inquiries` - Price negotiations
   - `reviews` - Book ratings/comments
   - `wishlists` - Saved books

---

## 🚢 Deployment Preparation

Ready to deploy? Follow these steps:

### Backend Deployment
```bash
# Build for production
npm run build

# Deploy to Heroku/Railway/Vercel
heroku create bookrsell-api
git push heroku main
```

### Frontend Deployment
```bash
# Build React
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

### Environment Variables
```
Backend:
- NODE_ENV=production
- MONGO_URI=cloud-mongodb-url
- JWT_SECRET=strong-secret-key
- PORT=5000

Frontend:
- REACT_APP_API_URL=https://your-api.com
```

---

## 💡 Pro Tips

### 1. Use Incognito Mode
Test multiple accounts without logging out:
```
Ctrl+Shift+N (Chrome/Edge)
Cmd+Shift+N (Chrome/Edge Mac)
Ctrl+Shift+P (Firefox)
```

### 2. Monitor Network Requests
Keep DevTools Network tab open to see all API calls in real-time.

### 3. Check LocalStorage
```javascript
// In browser console
localStorage.getItem('token')     // See JWT token
localStorage.getItem('user')      // See user object
localStorage.clear()              // Clear all data
```

### 4. Reset Database
```bash
# Delete all collections
use bookrsell
db.dropDatabase()

# Then restart and create new test data
```

### 5. Pretty Print JSON Responses
```javascript
// In browser console
JSON.parse(localStorage.getItem('user'))
// Shows formatted user object
```

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `taskkill /PID xxxxx /F` |
| MongoDB not responding | Start: `mongod` or use Compass |
| Dependencies missing | Run: `npm install` in both folders |
| Frontend blank page | Check console (F12) for errors |
| API 404 errors | Verify backend is running |
| Token expired | Login again to get new token |
| CORS errors | Check server .env CORS_ORIGIN |

---

## 🎓 Learning Path

Master the features in this order:

1. **Authentication** → Register/Login
2. **Book Management** → Add/View/Edit books
3. **Inquiry System** → Send/Receive negotiations
4. **Reviews** → Leave 5-star ratings
5. **Wishlist** → Save favorite books
6. **Admin** → Manage users/content

---

## 🚀 You're All Set!

Everything is configured and ready to run. Just execute the commands above and start testing!

```
npm run dev    (Backend)
npm start      (Frontend)
http://localhost:3001   (Open in browser)
```

**Happy coding! 🎉**

---

## 📚 Additional Resources

- Mongoose Docs: https://mongoosejs.com
- Express Guide: https://expressjs.com
- React Docs: https://react.dev
- Bootstrap: https://getbootstrap.com
- JWT Guide: https://jwt.io

---

**Questions?** Check the error message in the terminal - it usually tells you exactly what's wrong!
