# BookRsell Development Guide

Quick reference for development, troubleshooting, and useful commands.

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
- Runs on http://localhost:5000
- Auto-reloads with nodemon

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
- Runs on http://localhost:3000
- Auto-reloads on file changes

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm start  # Requires serve package
```

## 📦 NPM Scripts

### Backend Scripts
```bash
npm run dev      # Development with nodemon
npm start        # Production server
npm test         # Run tests (when configured)
```

### Frontend Scripts
```bash
npm start        # Start dev server
npm build        # Create production build
npm test         # Run tests
npm eject        # WARNING: Irreversible
```

## 🔧 Useful Development Commands

### MongoDB Commands

```bash
# Start MongoDB (if local)
mongod

# Connect to MongoDB (in another terminal)
mongo

# View databases
show dbs

# Select BookRsell database
use bookrsell

# View collections
show collections

# View users
db.users.find()

# View books
db.books.find()

# Count documents
db.books.countDocuments()

# View specific book
db.books.findOne({_id: ObjectId("...")})
```

### Backend API Testing with cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123","city":"Delhi","role":"seller"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get all books
curl http://localhost:5000/api/books

# Get book by ID
curl http://localhost:5000/api/books/[book_id]

# Add book (with auth token)
curl -X POST http://localhost:5000/api/books \
  -H "Authorization: Bearer [token]" \
  -F "title=Java Book" \
  -F "author=Author Name" \
  -F "price=500" \
  -F "category=Engineering" \
  -F "description=Good book" \
  -F "city=Delhi" \
  -F "image=@/path/to/image.jpg"
```

## 🐛 Debugging Tips

### Frontend Debugging

1. **Open Browser DevTools:**
   - F12 or Right-click → Inspect
   - Console tab for errors
   - Network tab for API calls
   - Application tab for localStorage

2. **Check localStorage:**
   ```javascript
   localStorage.getItem('token')
   localStorage.getItem('user')
   ```

3. **React DevTools Extension:**
   - Install React DevTools browser extension
   - View component tree and props

4. **Network Request:**
   - Open Network tab in DevTools
   - Look for API response/errors
   - Check request headers for Authorization

### Backend Debugging

1. **Server Console:**
   - Check stdout for errors
   - Look for "Server is running" message
   - Check MongoDB connection message

2. **Error Logs:**
   - Add console.log() in controllers
   - Check error middleware output
   - Enable detailed error messages

3. **MongoDB Issues:**
   ```bash
   # Check MongoDB status
   ps aux | grep mongod
   
   # Test connection
   mongo mongodb://localhost:27017/bookrsell
   ```

## ❌ Common Issues & Solutions

### Issue: "Can't connect to localhost:5000"
```
Solutions:
1. Check if backend is running: npm run dev
2. Check port isn't blocked
3. Verify REACT_APP_API_URL in .env
4. Try different port: change PORT in server/.env
```

### Issue: "MongoDB connection failed"
```
Solutions:
1. Start MongoDB: mongod
2. Check MONGODB_URI in server/.env
3. If using Atlas: whitelist IP in MongoDB Atlas
4. Check firewall settings
```

### Issue: "Token is invalid"
```
Solutions:
1. Clear localStorage and login again
2. Check JWT_SECRET matches server
3. Check token hasn't expired (7 days)
4. Verify Authorization header format
```

### Issue: "Image upload not working"
```
Solutions:
1. Check uploads/ folder exists
2. File must be under 5MB
3. Only JPEG, PNG, GIF allowed
4. Check form has enctype="multipart/form-data"
```

### Issue: "CORS error"
```
Solutions:
1. Check CORS is enabled in server.js
2. Verify frontend URL is whitelisted
3. Clear browser cache and cookies
4. Check API_URL in .env
```

## 📝 Code Snippets

### Add Book with Image (Frontend)
```javascript
const handleSubmit = async (formData, imageFile) => {
  const form = new FormData();
  form.append('title', formData.title);
  form.append('author', formData.author);
  form.append('price', formData.price);
  form.append('category', formData.category);
  form.append('description', formData.description);
  form.append('city', formData.city);
  form.append('condition', formData.condition);
  if (imageFile) {
    form.append('image', imageFile);
  }
  
  const response = await bookAPI.addBook(form);
};
```

### Fetch Books with Filters (Frontend)
```javascript
const response = await bookAPI.getBooks({
  category: 'Engineering',
  city: 'Delhi',
  minPrice: 100,
  maxPrice: 1000,
  search: 'Java',
  page: 1,
  limit: 10
});
```

### Protected Route (Backend)
```javascript
router.post('/books', authMiddleware, upload.single('image'), bookController.addBook);

// authMiddleware verifies token:
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  next();
};
```

### Query with Filters (Backend)
```javascript
const filter = {};
if (category) filter.category = category;
if (city) filter.city = city;
if (minPrice || maxPrice) {
  filter.price = {};
  if (minPrice) filter.price.$gte = minPrice;
  if (maxPrice) filter.price.$lte = maxPrice;
}
if (search) {
  filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { author: { $regex: search, $options: 'i' } }
  ];
}

const books = await Book.find(filter);
```

## 🧹 Cleanup Commands

```bash
# Remove node_modules (free up space)
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Remove build folder
rm -rf build/

# Reset database (warning: deletes all data)
# In MongoDB shell:
db.dropDatabase()
```

## 📊 Performance Tips

1. **Frontend:**
   - Use lazy loading for components
   - Optimize images
   - Enable production build
   - Use React DevTools Profiler

2. **Backend:**
   - Add indexes to MongoDB
   - Use pagination for large datasets
   - Cache frequently accessed data
   - Monitor server logs

3. **Database:**
   - Create indexes for searches
   - Archive old data periodically
   - Monitor query performance

## 🔒 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use MongoDB Atlas (not local)
- [ ] Enable HTTPS
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for approved domains
- [ ] Set strong passwords in production
- [ ] Regular database backups
- [ ] Monitor error logs

## 📚 Useful Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Bootstrap Docs](https://getbootstrap.com/docs)
- [JWT Info](https://jwt.io/)

## 🚀 Deployment Checklist

### Before Deploying:
- [ ] Update all dependencies: `npm update`
- [ ] Test frontend build: `npm run build`
- [ ] Check .env variables
- [ ] Test all API endpoints
- [ ] Verify CORS settings
- [ ] Check error handling
- [ ] Test image uploads
- [ ] Verify database backups

### Deploy Backend:
```bash
cd server
heroku create bookrsell-api
git push heroku main
heroku config:set JWT_SECRET=production_secret
```

### Deploy Frontend:
```bash
cd client
npm run build
vercel deploy --prod
```

## 💡 Pro Tips

1. Use Postman to test APIs before testing in frontend
2. Keep browser DevTools open while developing
3. Use VS Code extensions (ES7, Prettier, Thunder Client)
4. Commit frequently to Git
5. Keep .env files secure and out of git
6. Test on mobile devices for responsiveness
7. Use React.lazy for code splitting

---

Happy coding! 🎉
