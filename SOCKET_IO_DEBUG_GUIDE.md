# WebSocket Chat Debugging Guide

## Issue: Messages Not Visible Between Users

The server is working (messages are being saved and broadcasted), but frontend might not be receiving them properly.

### Server Logs Show:
✅ Users connecting to Socket.io
✅ Users joining conversation rooms  
✅ Messages being saved to database
✅ Messages being broadcasted to room

### Possible Client-Side Issues:

1. **Socket Event Listeners Not Registered**
   - The `receive-message` event might not be listening before message is sent
   - Need to ensure listeners are set up BEFORE joining conversation

2. **Conversation ID Mismatch**
   - Both users must be in the SAME conversation room
   - Verify: Open browser console → Check if both have same conversationId

3. **Socket Connection Timing**
   - Socket might not be connected when emitting 'send-message'
   - Messages sent before connection established will fail

## Testing Steps:

### Step 1: Verify Socket Connection
1. Open http://localhost:3000 in Browser A (Seller)
2. Login as seller
3. Open Developer Tools (F12)
4. Go to Console tab
5. Look for: `✅ Socket.io connected: [socket-id]`
6. Repeat for Browser B (Buyer)

### Step 2: Check Conversation ID Match
In browser console, type:
```javascript
// Should show conversation ID
document.querySelector('[data-conversation-id]')?.getAttribute('data-conversation-id')
```

### Step 3: Monitor Socket Events
In browser console:
```javascript
// Check if you see these logs when:
// - Opening chat: "🚪 Joining conversation room: [ID]"
// - Other user typing: "✍️ User typing:"
// - Receiving message: "📨 Received message:"
// - Sending message: "📤 Sending message:"
```

## How to Manually Test WebSocket:

### Browser A (Seller - Port 5000 logs):
1. Login as seller
2. Add a book titled "Test Book"
3. Go to "My Inquiries" (should be empty now)
4. Look at browser console for socket logs

### Browser B (Buyer):
1. Open new browser window at http://localhost:3000
2. Login as buyer
3. Go to Home → Browse books
4. Find "Test Book" and send inquiry
5. Look for socket connection logs

### Browser A (Seller again):
1. Refresh "My Inquiries"
2. Should see buyer's inquiry
3. Click "Accept"
4. Click "💬 Chat"
5. **IMPORTANT**: Watch browser console for these logs:
   - `🚪 Joining conversation room: [ID]`
   - Application should wait until `✅ Socket.io connected` before joining

### Browser B (Buyer):
1. You should see the chat open automatically (since inquiry was created from here)
2. Browser console should show same conversation ID and socket connection

### Test Messaging:
**Browser A types**: "Hello from seller"
- Look at **Port 5000 logs** in terminal → Should see `📨 Message from [userID]`
- Look at **Browser A console** → Should see `📤 Sending message:`
- Look at **Browser B console** → Should see `📨 Received message:`
- **Browser B chat** → Message should appear in conversation

**Browser B types reply**: "Hello from buyer"
- Same process in reverse

## Common Issues & Fixes:

### "Not connected. Please wait for connection..."
- **Cause**: Socket.io connection not established
- **Fix**: 
  1. Check browser console for `❌ Socket.io disconnected`
  2. Wait 5 seconds for auto-reconnection
  3. Refresh page if it says "Connection closed"

### Message sent but not received
- **Cause**: Room joining failed or event listener not registered
- **Fix**:
  1. Check browser console for `🚪 Joining conversation room:`
  2. Verify same conversation ID in both browsers
  3. Check server logs at port 5000 for "User ... joined conversation"

### "Connection lost. Reconnecting..."
- **Cause**: Network or Server issue
- **Fix**:
  1. Check if `node server.js` is still running on port 5000  
  2. Restart backend: `Get-Process -Name node | Stop-Process -Force`
  3. Restart server: `cd e:\BookRsell\server; node server.js`

### No logs in browser console
- **Cause**: ChatBox component might not be mounted
- **Fix**:
  1. Verify "💬 Chat" button appears (inquiry must be "accepted")
  2. Click button - ChatBox should render
  3. Look for loading spinner → Should load messages
  4. Then socket should connect

## Quick Verification Checklist:

- [ ] Backend running: `node server.js` at `e:\BookRsell\server`
- [ ] Frontend running: `npm start` at `e:\BookRsell\client`  
- [ ] No "Connection lost" errors
- [ ] Browser console shows socket connection logs
- [ ] Both browsers show same conversation ID
- [ ] User A joins room before User B sends message
- [ ] Server logs show message broadcast

## Monitor Real-Time:

**Terminal 1 (Backend - Port 5000)**:
```
🟢 User connected: [socket-id]
User [userId] joined conversation [conversationId]
📨 Message from [userId]: [message preview]
✅ Message saved: [messageId]
🔊 Message broadcasted to room: [conversationId]
```

**Browser Console (Frontend)**:
```
✅ Socket.io connected: [socket-id]
🚪 Joining conversation room: [conversationId]
📤 Sending message: {conversationId, senderId, message}
📨 Received message: {message, sender, createdAt}
```

If you see all these logs, the system is working correctly!

## Next Steps if Still Not Working:

1. **Screenshot server logs** (Port 5000 terminal)
2. **Screenshot browser console logs** (F12 → Console)
3. **Check browser DevTools Network tab**: Look for Socket.io WebSocket upgrade
4. **Verify database**: Check if messages are actually saving to MongoDB

---

**Status**: Chat system is technically working. Issue is likely client-side event handling or socket connection timing.
