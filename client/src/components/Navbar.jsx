import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaPlus, FaHome, FaHeart, FaComments, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <nav className={`navbar-enhanced ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => handleNavClick('/')}>
          <span className="logo-icon">📚</span>
          <span className="logo-text">BookRsell</span>
        </div>

        {/* Hamburger Toggle */}
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <a href="/" className="nav-item home-link" onClick={closeMenu}>
            <FaHome className="nav-icon" />
            Home
          </a>

          {token ? (
            <>
              <a href="/add-book" className="nav-item add-book-link" onClick={closeMenu}>
                <FaPlus className="nav-icon" />
                Add Book
              </a>
              <a href="/my-ads" className="nav-item" onClick={closeMenu}>
                <i className="bi bi-bag"></i>
                My Ads
              </a>
              <a href="/wishlist" className="nav-item wishlist-link" onClick={closeMenu}>
                <FaHeart className="nav-icon" />
                Wishlist
              </a>
              <a href="/my-inquiries" className="nav-item" onClick={closeMenu}>
                <FaComments className="nav-icon" />
                Inquiries
              </a>
              <a href="/messages" className="nav-item" onClick={closeMenu}>
                <FaEnvelope className="nav-icon" />
                Messages
              </a>
              <a href="/profile" className="nav-item profile-link" onClick={closeMenu}>
                <FaUser className="nav-icon" />
                {user.name ? user.name.split(' ')[0] : 'Profile'}
              </a>
              <button className="nav-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" />
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="nav-item login-link" onClick={closeMenu}>
                Login
              </a>
              <a href="/register" className="nav-item signup-link" onClick={closeMenu}>
                Register
              </a>
            </>
          )}
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="nav-auth-desktop">
          {!token && (
            <>
              <a href="/login" className="btn-login">Login</a>
              <a href="/register" className="btn-signup">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
