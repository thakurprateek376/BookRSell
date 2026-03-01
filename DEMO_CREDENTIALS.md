# BookRsell - Demo Test Credentials

## 🔑 Demo User Accounts (Ready to Use)

### Option 1: Register New Users
You can register new users directly on the registration page.

**Example Credentials to Register:**

```
User 1 (Seller):
Name: John Smith
Email: john@example.com
Password: john123456
Phone: 03001234567
City: Karachi
Role: Seller (Buy & Sell books)

User 2 (Buyer):
Name: Ahmed Khan
Email: ahmed@example.com
Password: ahmed123456
Phone: 03009876543
City: Islamabad
Role: Buyer (Only buying books)

User 3 (Seller):
Name: Sarah Williams
Email: sarah@example.com
Password: sarah123456
Phone: 03112223333
City: Lahore
Role: Seller (Buy & Sell books)
```

### Option 2: Use Pre-Created Database Users

If you want to use pre-created users in MongoDB, here are the MongoDB documents to insert:

```javascript
// User 1: John (Seller)
{
  name: "John Smith",
  email: "john@example.com",
  password: "$2a$10$...", // bcrypt hash of "john123456"
  phone: "03001234567",
  city: "Karachi",
  role: "seller",
  authProvider: "local",
  createdAt: new Date(),
  updatedAt: new Date()
}

// User 2: Ahmed (Buyer)
{
  name: "Ahmed Khan",
  email: "ahmed@example.com",
  password: "$2a$10$...", // bcrypt hash of "ahmed123456"
  phone: "03009876543",
  city: "Islamabad",
  role: "buyer",
  authProvider: "local",
  createdAt: new Date(),
  updatedAt: new Date()
}

// User 3: Sarah (Seller)
{
  name: "Sarah Williams",
  email: "sarah@example.com",
  password: "$2a$10$...", // bcrypt hash of "sarah123456"
  phone: "03112223333",
  city: "Lahore",
  role: "seller",
  authProvider: "local",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

---

## 🧪 How to Test with These Credentials

### Test 1: Login & Browse Books
1. Go to: http://localhost:3001/login
2. Enter:
   - Email: `john@example.com`
   - Password: `john123456`
3. Click "Login"
4. ✅ Should see homepage with books

### Test 2: Buy a Book (Buyer)
1. Go to: http://localhost:3001/login
2. Enter:
   - Email: `ahmed@example.com`
   - Password: `ahmed123456`
3. Browse books listed by John
4. Click on a book
5. Click "Send Inquiry" button
6. Fill form:
   - Message: "Can you reduce price?"
   - Price: 300
7. Click "Send Inquiry"
8. ✅ Should see success message

### Test 3: Sell a Book (Seller)
1. Login as John: `john@example.com` / `john123456`
2. Go to "Add Book" page
3. Fill form:
   - Title: "Harry Potter"
   - Author: "J.K. Rowling"
   - Price: 500
   - Condition: Used
   - Category: Fiction
   - Description: "Great condition"
4. Upload book image
5. Click "Add Book"
6. ✅ Book should appear in your listings

### Test 4: Receive & Respond to Inquiry (Seller)
1. Login as John: `john@example.com` / `john123456`
2. Go to "My Inquiries" page
3. Click "Inquiries Received" tab
4. ✅ Should see inquiries from Ahmed
5. Click "Accept" or "Reject" button
6. ✅ Status should update instantly

### Test 5: View Wishlist (Buyer)
1. Login as Ahmed: `ahmed@example.com` / `ahmed123456`
2. Browse books
3. Click heart icon on any book
4. Go to "Wishlist" page
5. ✅ Should see saved books

### Test 6: Check Reviews
1. After accepting an inquiry:
   - Buyer can rate the transaction
   - Go to book page
   - Click "Leave Review"
   - Rate 1-5 stars
   - Add comment
   - Submit

---

## 🎯 Testing Workflows

### Complete Buy-Sell Flow:
```
1. Seller (John) adds a book
2. Buyer (Ahmed) browses and finds it
3. Buyer sends inquiry with price offer
4. Seller receives inquiry notification
5. Seller accepts/rejects offer
6. If accepted:
   - Buyer sees status changed
   - Transaction marked as completed
   - Both can leave reviews
```

### Wishlist Testing:
```
1. Login as Buyer (Ahmed)
2. Click heart on books to save
3. Go to Wishlist page
4. See all saved books
5. Click to view details
6. Can send inquiry from wishlist
```

### Review Testing:
```
1. Complete a transaction
2. Go to book page
3. Click "Leave Review"
4. Rate 1-5 stars
5. Write comment
6. Submit review
7. See review appear on book page
```

---

## 📱 Key Features to Test

### For Sellers:
- ✅ Register with seller role
- ✅ Add multiple books
- ✅ Upload book images
- ✅ Set prices
- ✅ Receive inquiries
- ✅ Accept/Reject offers
- ✅ Mark books as sold
- ✅ View transaction history
- ✅ Manage profile
- ✅ View seller ratings

### For Buyers:
- ✅ Register with buyer role
- ✅ Browse books
- ✅ Send inquiries
- ✅ Negotiate prices
- ✅ Save to wishlist
- ✅ Track inquiry status
- ✅ Leave reviews
- ✅ View transaction history
- ✅ Manage profile

---

## 🔧 Quick Registration Method

**Fastest way to get started:**

1. Open: http://localhost:3001/register
2. Fill registration form with:
   ```
   Name: John Smith
   Email: john@example.com
   Password: john123456
   City: Karachi
   Account Type: Seller
   ```
3. Click "Create Account"
4. ✅ Automatically logs in
5. Ready to add books!

Repeat with different emails for multiple test users.

---

## 💡 Pro Tips for Testing

1. **Use Different Browsers:**
   - Chrome for Seller (John)
   - Firefox for Buyer (Ahmed)
   - This way you can login to both simultaneously

2. **Test on Mobile:**
   - Right-click → Inspect → Device Toolbar
   - Test responsive design
   - Test touch interactions

3. **Check Console for Errors:**
   - Press F12 to open Developer Tools
   - Watch Console tab for any JS errors
   - Check Network tab for API calls

4. **Verify Backend Calls:**
   - Open Network tab
   - Perform actions (login, add book, send inquiry)
   - Watch API calls complete successfully
   - Check response status (201, 200, etc.)

---

## ✅ Checklist Before Going Live

- [ ] Can register new users
- [ ] Can login successfully
- [ ] Can add books as seller
- [ ] Can send inquiries as buyer
- [ ] Can receive inquiries as seller
- [ ] Can accept/reject inquiries
- [ ] Can save to wishlist
- [ ] Can leave reviews
- [ ] Can update profile
- [ ] Can delete listings
- [ ] Works on mobile
- [ ] Works on desktop
- [ ] No console errors

---

## 🆘 If Login Fails

**Check these:**
1. Backend running? (http://localhost:5000/health)
2. User exists in database?
3. Password correct?
4. Email format valid?
5. Check browser console for errors
6. Check backend server logs

**Quick fix:**
1. Go to register page
2. Register new user with email + password
3. Use those credentials to login

---

## 📊 Sample Test Data to Add

After registering, add these books for testing:

**Book 1 (by John):**
- Title: The Hobbit
- Author: J.R.R. Tolkien
- Price: 450
- Category: Fiction
- Condition: Used

**Book 2 (by John):**
- Title: Harry Potter 1
- Author: J.K. Rowling
- Price: 500
- Category: Fantasy
- Condition: Like New

**Book 3 (by Sarah):**
- Title: Python Programming
- Author: Mark Lutz
- Price: 2500
- Category: Technical
- Condition: New

Then test buying/inquiring on these books!

---

**You're all set! Start registering and testing now!** 🚀
