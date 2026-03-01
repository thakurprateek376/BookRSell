# BookRsell Frontend - React App

React.js frontend for BookRsell - Second-hand Book Marketplace

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

## 📁 Folder Structure

```
client/src/
├── assets/
│   └── images/               # Image assets
├── components/
│   ├── Navbar.jsx            # Navigation bar
│   ├── Footer.jsx            # Footer
│   ├── BookCard.jsx          # Book display card
│   ├── SearchBar.jsx         # Search functionality
│   ├── FilterSection.jsx     # Filter options
│   └── Loader.jsx            # Loading spinner
├── pages/
│   ├── Home.jsx              # Home/Browse books
│   ├── BookDetails.jsx       # Single book view
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── AddBook.jsx           # Post new book
│   ├── MyAds.jsx             # My listings
│   └── Profile.jsx           # User profile
├── services/
│   └── api.js                # Axios API calls
├── styles/
│   └── main.css              # Custom CSS
├── App.js                    # App routing
└── index.js                  # Entry point
```

## 📦 Dependencies

```bash
npm install react react-dom
npm install react-router-dom
npm install axios
npm install bootstrap
npm install tailwindcss
npm install react-icons
```

## 🎨 Available Pages

### Home (`/`)
- Browse all books
- Search by title/author
- Filter by category, city, price
- Pagination

### Book Details (`/book/:id`)
- Full book information
- Seller contact details
- Condition and category

### Login (`/login`)
- User authentication
- JWT token stored

### Register (`/register`)
- New user registration
- Choose role (buyer/seller)

### Add Book (`/add-book`)
- Post a new book ad
- Upload image
- Set price, category, condition

### My Ads (`/my-ads`)
- View user's listings
- Edit book details
- Delete listings

### Profile (`/profile`)
- View profile information
- Edit name, city, phone
- View role

## 🔐 Authentication

- JWT token stored in localStorage
- Token sent with every protected request
- Auto-logout when token expires

## 🎯 Components

### Navbar
- Navigation links
- Login/Logout
- User info

### SearchBar
- Search books by title/author
- Form submission

### FilterSection
- Category filter
- City filter
- Price range filter
- Apply/Reset buttons

### BookCard
- Book image
- Title and author
- Price and condition
- Location
- Click to view details

### Footer
- Links
- Copyright info

### Loader
- Loading spinner
- Displayed while fetching data

## 📲 Page Features

### Home
✅ Displays all available books
✅ Search and filter functionality
✅ Responsive grid layout
✅ Pagination support

### BookDetails
✅ Full book information
✅ Seller contact information
✅ Image gallery
✅ Book condition badge
✅ Category and price display

### AddBook
✅ Form validation
✅ Image upload
✅ Category selection
✅ Condition selection
✅ Success messages

### MyAds
✅ User's book listings
✅ Edit functionality
✅ Delete functionality
✅ Status display
✅ Table view

### Profile
✅ User information display
✅ Edit mode toggle
✅ Update profile
✅ Phone and city editing

## 🌐 API Integration

All API calls are in `src/services/api.js`:

```javascript
// Auth APIs
authAPI.register(data)
authAPI.login(data)

// Book APIs
bookAPI.getBooks(params)
bookAPI.getBook(id)
bookAPI.addBook(formData)
bookAPI.updateBook(id, formData)
bookAPI.deleteBook(id)
bookAPI.getSellerBooks()

// User APIs
userAPI.getProfile()
userAPI.updateProfile(data)
userAPI.getSellerInfo(id)
```

## 🎨 Styling

### Bootstrap
- Responsive grid system
- Components (cards, buttons, forms)
- Utilities

### Custom CSS (`main.css`)
- Color scheme
- Animations
- Hover effects
- Responsive design

### Color Scheme
- Primary: #667eea
- Secondary: #764ba2
- Success: #28a745
- Danger: #dc3545

## 📱 Responsive Design

- Mobile-first approach
- Bootstrap grid system
- Tailwind CSS utilities
- Responsive breakpoints (sm, md, lg, xl)

## 🔧 Configuration

### API Base URL
Set in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Image URL
Books served from:
```
http://localhost:5000/uploads/[image-path]
```

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

### GitHub Pages
```bash
npm run build
# Configure for GitHub Pages
```

.env for production:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 🆘 Troubleshooting

**Can't connect to backend**
- Check backend is running on port 5000
- Verify REACT_APP_API_URL in .env
- Check CORS settings on backend

**Image not loading**
- Verify image path on server
- Check uploads folder has correct permissions

**Login not working**
- Clear localStorage
- Check backend is running
- Verify JWT_SECRET matches backend

## 📋 Component Props

### BookCard
```jsx
<BookCard book={{ _id, title, author, price, image, condition, city, category }} />
```

### FilterSection
```jsx
<FilterSection onFilter={(filters) => handleFilter(filters)} />
```

### SearchBar
```jsx
<SearchBar onSearch={(query) => handleSearch(query)} />
```

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search (can be added)
- `Esc` - Close modals

## 🎯 Form Validation

- Email format validation
- Password minimum length (6 characters)
- Required field validation
- Number field validation for price

## 📊 State Management

Currently using React hooks (useState, useContext can be added):
- useState for component state
- localStorage for auth persistence

## 🔄 Data Flow

1. User interaction (click, form submit)
2. API call via axios
3. Response handling
4. State update
5. Component re-render

## 🌟 Features

✨ Search and filter books
✨ User authentication
✨ Post/manage listings
✨ View seller details
✨ Responsive design
✨ Image uploads
✨ User profile management

---

Built with React ❤️ for BookRsell
