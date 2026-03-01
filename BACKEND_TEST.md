# Backend CRUD Operations Test Report

## Test Account
- Email: `testuser2@example.com`
- Password: `123456`
- Role: `seller`

## API Base URL
`http://localhost:5000/api`

---

## ENDPOINTS TO TEST

### 1. AUTHENTICATION
- ✅ `POST /auth/register` - Create new user
- ✅ `POST /auth/login` - Login user
- ✅ `POST /auth/google` - Google OAuth login

### 2. USERS
- `GET /users/profile` - Get logged-in user profile
- `PUT /users/profile` - Update user profile
- `GET /users/:id` - Get seller info

### 3. BOOKS (CRUD)
- `GET /books` - Get all books (with filters)
- `GET /books/:id` - Get single book
- `POST /books` - Create new book (requires multipart form-data)
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book
- `GET /books/seller/myads` - Get seller's books

### 4. INQUIRIES
- `GET /inquiries` - Get user's inquiries
- `POST /inquiries` - Create inquiry
- `PUT /inquiries/:id` - Update inquiry
- `DELETE /inquiries/:id` - Delete inquiry

### 5. REVIEWS
- `GET /reviews/:bookId` - Get book reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### 6. WISHLIST
- `GET /wishlist` - Get user's wishlist
- `POST /wishlist` - Add book to wishlist
- `DELETE /wishlist/:bookId` - Remove from wishlist

### 7. CHAT
- `GET /chat/conversations` - Get conversations
- `POST /chat/conversation` - Create/get conversation
- `GET /chat/messages/:conversationId` - Get messages
- `POST /chat/message` - Send message
- `DELETE /chat/conversation/:id` - Delete conversation

---

## Testing Instructions

### Step 1: Get Authentication Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser2@example.com","password":"123456"}'
```

Copy the `token` from response.

### Step 2: Test with Token
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the token from Step 1.

---

## Status Check

Run this command to verify backend is working:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "BookRsell API is running!"
}
```
