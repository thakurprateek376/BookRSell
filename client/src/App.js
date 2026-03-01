import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBook from './pages/AddBook';
import MyAds from './pages/MyAds';
import Profile from './pages/Profile';
import MyInquiries from './pages/MyInquiries';
import Wishlist from './pages/Wishlist';
import Messages from './pages/Messages';
import './styles/main.css';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Router>
          <LoadingOverlay />
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 300px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/my-ads" element={<MyAds />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-inquiries" element={<MyInquiries />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
