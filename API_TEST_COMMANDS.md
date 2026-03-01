# BookRsell Backend - Quick CRUD Test Commands

## Prerequisites
- Backend running on: `http://localhost:5000`
- Test user: `testuser2@example.com` / `123456`

---

## STEP 1: Authentication (Required First)

### Get Token
```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser2@example.com","password":"123456"}' \
  | jq '.token' -r > token.txt

# Or in Windows PowerShell:
$loginResp = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method Post -ContentType "application/json" `
  -Body '{"email":"testuser2@example.com","password":"123456"}' -UseBasicParsing
$token = ($loginResp.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

**Save your token and use it in the `TOKEN` variable below**

---

## STEP 2: Test All CRUD Operations

### USER ENDPOINTS

#### 1. Get User Profile
```bash
curl -s -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```
Expected: Returns user data (name, email, city, role)

#### 2. Update User Profile
```bash
curl -s -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestUser Updated","city":"New York","phone":"555-1234"}'
```
Expected: Returns updated user data

---

### BOOK ENDPOINTS (FULL CRUD)

#### 1. GET - Retrieve All Books
```bash
curl -s -X GET "http://localhost:5000/api/books" | jq '.'
```
Optional query parameters:
```bash
curl -s -X GET "http://localhost:5000/api/books?category=Fiction&city=Boston&page=1&limit=10"
curl -s -X GET "http://localhost:5000/api/books?search=novel"
curl -s -X GET "http://localhost:5000/api/books?minPrice=10&maxPrice=100"
```

#### 2. GET - Get Single Book
```bash
# Replace BOOK_ID with an actual book ID from previous call
curl -s -X GET "http://localhost:5000/api/books/BOOK_ID" | jq '.'
```

#### 3. POST - Create New Book
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Authorization: Bearer TOKEN" \
  -F "title=The Great Gatsby" \
  -F "author=F. Scott Fitzgerald" \
  -F "price=12.99" \
  -F "category=Fiction" \
  -F "description=A classic American novel" \
  -F "city=Boston" \
  -F "condition=Like New" \
  -F "image=@/path/to/book/image.jpg"
```
Expected: Returns created book with ID

#### 4. PUT - Update Book
```bash
curl -s -X PUT http://localhost:5000/api/books/BOOK_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":14.99,"description":"Updated description"}'
```

#### 5. DELETE - Delete Book
```bash
curl -s -X DELETE http://localhost:5000/api/books/BOOK_ID \
  -H "Authorization: Bearer TOKEN"
```
Expected: Success message

#### 6. GET - User's Own Books (My Ads)
```bash
curl -s -X GET http://localhost:5000/api/books/seller/myads \
  -H "Authorization: Bearer TOKEN"
```

---

### INQUIRY ENDPOINTS

#### 1. POST - Create Inquiry
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId":"BOOK_ID",
    "message":"Is this book still available?",
    "buyerEmail":"testuser2@example.com"
  }'
```

#### 2. GET - Get Buyer's Inquiries
```bash
curl -s -X GET http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer TOKEN"
```

#### 3. PUT - Update Inquiry Status (Seller Response)
```bash
curl -s -X PUT http://localhost:5000/api/inquiries/INQUIRY_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status":"Responded",
    "sellerResponse":"Yes, still available. Price negotiable."
  }'
```

#### 4. DELETE - Delete Inquiry
```bash
curl -s -X DELETE http://localhost:5000/api/inquiries/INQUIRY_ID \
  -H "Authorization: Bearer TOKEN"
```

---

### REVIEW ENDPOINTS

#### 1. POST - Create Review
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId":"BOOK_ID",
    "rating":5,
    "comment":"Great book in excellent condition!"
  }'
```

#### 2. GET - Get Reviews for Book
```bash
curl -s -X GET http://localhost:5000/api/reviews/BOOK_ID
```

#### 3. PUT - Update Review
```bash
curl -s -X PUT http://localhost:5000/api/reviews/REVIEW_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating":4,"comment":"Updated review"}'
```

#### 4. DELETE - Delete Review
```bash
curl -s -X DELETE http://localhost:5000/api/reviews/REVIEW_ID \
  -H "Authorization: Bearer TOKEN"
```

---

### WISHLIST ENDPOINTS

#### 1. GET - Get Wishlist
```bash
curl -s -X GET http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer TOKEN"
```

#### 2. POST - Add to Wishlist
```bash
curl -X POST http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"BOOK_ID"}'
```

#### 3. DELETE - Remove from Wishlist
```bash
curl -s -X DELETE http://localhost:5000/api/wishlist/BOOK_ID \
  -H "Authorization: Bearer TOKEN"
```

---

### CHAT ENDPOINTS

#### 1. GET - Get Conversations
```bash
curl -s -X GET http://localhost:5000/api/chat/conversations \
  -H "Authorization: Bearer TOKEN"
```

#### 2. POST - Create/Get Conversation
```bash
curl -X POST http://localhost:5000/api/chat/conversation \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"BOOK_ID","inquiryId":"INQUIRY_ID"}'
```

#### 3. GET - Get Messages
```bash
curl -s -X GET http://localhost:5000/api/chat/messages/CONVERSATION_ID \
  -H "Authorization: Bearer TOKEN"
```

#### 4. POST - Send Message
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"CONV_ID","message":"Hello, is this available?"}'
```

#### 5. DELETE - Delete Conversation
```bash
curl -s -X DELETE http://localhost:5000/api/chat/conversation/CONVERSATION_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## TESTING CHECKLIST

- [ ] **Authentication:** Login and register work
- [ ] **Users:** Can get and update profile
- [ ] **Books CREATE:** Can post book with image
- [ ] **Books READ:** Can get all and single books with filters
- [ ] **Books UPDATE:** Can modify book details
- [ ] **Books DELETE:** Can remove books
- [ ] **Inquiries:** Can create and respond to inquiries
- [ ] **Reviews:** Can create, read, update reviews
- [ ] **Wishlist:** Can add/remove books
- [ ] **Chat:** Can create conversations and send messages

---

## TROUBLESHOOTING

### 401 Unauthorized
- Token has expired
- Token is invalid
- Solution: Get a new token

### 404 Not Found
- Wrong endpoint URL
- Resource doesn't exist
- Solution: Check endpoint and ID

### 500 Server Error
- Check server logs
- Verify database connection
- Check request format

### Image Upload fails
- Make sure to use `-F` (form data)
- Image file must exist
- Use absolute or relative path to file

---

## Notes
- All timestamps in ISO 8601 format
- Soft delete on books (isActive flag)
- Real-time chat requires Socket.io connection
- Pagination default: page=1, limit=10
- Price validation: must be positive number
