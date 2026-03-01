#!/bin/bash

# BookRsell - Quick Start Script
# This script sets up and starts both frontend and backend

echo "🚀 Starting BookRsell Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Create uploads directory if not exists
mkdir -p server/uploads

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating with defaults..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookrsell
JWT_SECRET=bookrsell_secret_key_change_in_production
NODE_ENV=development
EOF
    echo "✅ .env created. Please update MONGODB_URI if needed."
fi

cd ..

# Frontend Setup
echo ""
echo "⚛️  Setting up Frontend..."
cd client

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF
    echo "✅ .env created"
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Make sure MongoDB is running:"
echo "   $ mongod"
echo ""
echo "2. In one terminal, start the backend:"
echo "   $ cd server && npm run dev"
echo ""
echo "3. In another terminal, start the frontend:"
echo "   $ cd client && npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more info, read:"
echo "   - README.md (Main documentation)"
echo "   - SETUP_GUIDE.md (Detailed setup)"
echo "   - ARCHITECTURE.md (System design)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
