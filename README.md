# BookRsell - Second-hand Book Marketplace

Welcome to BookRsell! An online platform where students can easily buy and sell old books, helping them save money and reduce waste.

## 🚀 Live Demo
[Coming Soon]

## 📋 Features

✅ **User Authentication** - Secure login and registration
✅ **Browse Books** - View all available second-hand books
✅ **Search & Filter** - Search by title/author, filter by category, city, and price
✅ **Book Details** - Complete information and seller contact details
✅ **Post Ads** - Sellers can add books with images and details
✅ **Manage Ads** - Edit, update, and delete posted books
✅ **User Profile** - View and update profile information
✅ **Image Upload** - Upload book images (Multer)
✅ **JWT Authentication** - Secure API endpoints
✅ **Responsive Design** - Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - Image upload handling
- **CORS** - Cross-origin requests

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **TailwindCSS** - Utility-first CSS
- **React Icons** - Icon library

## 📁 Project Structure

```
BookRsell/
├── client/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/           # Images and static files
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BookCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterSection.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AddBook.jsx
│   │   │   ├── MyAds.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/         # API calls
│   │   │   └── api.js
│   │   ├── styles/           # CSS
│   │   │   └── main.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                  # Environment variables
│   └── package.json
│
└── server/                    # Express Backend
    ├── config/               # Database config
    │   └── db.js
    ├── controllers/          # Business logic
    │   ├── authController.js
    │   ├── bookController.js
    │   └── userController.js
    ├── models/               # Database schemas
    │   ├── User.js
    │   └── Book.js
    ├── routes/               # API routes
    │   ├── authRoutes.js
    │   ├── bookRoutes.js
    │   └── userRoutes.js
    ├── middleware/           # Custom middleware
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── uploads/              # Uploaded files
    ├── .env                  # Environment variables
    ├── server.js             # Main server file
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the server folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookrsell
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

5. **Start the server**
```bash
npm run dev
```

The backend will run at `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the client folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## 📚 API Endpoints

### Authentication Routes
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
```

### Book Routes
```
GET    /api/books                  - Get all books with filters
GET    /api/books/:id              - Get book details
POST   /api/books                  - Add new book (auth required)
PUT    /api/books/:id              - Update book (auth required)
DELETE /api/books/:id              - Delete book (auth required)
GET    /api/books/seller/myads     - Get seller's books (auth required)
```

### User Routes
```
GET    /api/users/profile          - Get user profile (auth required)
PUT    /api/users/profile          - Update profile (auth required)
GET    /api/users/:id              - Get seller info
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:
- Token is stored in localStorage
- All protected routes require a valid token in the Authorization header
- Format: `Authorization: Bearer <token>`

## 📸 Image Upload

- Images are uploaded using Multer
- Max file size: 5MB
- Allowed formats: JPEG, PNG, GIF
- Images are stored in the `server/uploads` directory

## 🎨 Customization

### Change Primary Color
Edit `client/src/styles/main.css`:
```css
/* Change from #667eea to your color */
.btn-primary {
  background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
}
```

### Add More Categories
Update in `server/models/Book.js` and `client/src/components/FilterSection.jsx`:
```javascript
category: {
  enum: ['Engineering', 'Medical', 'Science', 'Arts', 'Commerce', 'Others', 'YOUR_CATEGORY'],
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network access if using MongoDB Atlas

### Frontend can't connect to backend
- Check if backend is running on port 5000
- Verify REACT_APP_API_URL in client/.env
- Check CORS settings in server.js

### Image upload not working
- Check uploads folder exists in server
- Verify Multer configuration
- Check file size and format

## 📧 Support

For issues or questions, please create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Chat/Messaging system between buyers and sellers
- [ ] Wishlist functionality
- [ ] Book ratings and reviews
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

Made with ❤️ for students
