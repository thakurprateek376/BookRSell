import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import './Wishlist.css';

const Wishlist = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/wishlist',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishlistBooks(response.data.wishlist.books || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Error loading wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/wishlist/remove/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishlistBooks(wishlistBooks.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Error removing book');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container my-5">
      <h2>My Saved Books</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {wishlistBooks.length === 0 ? (
        <div className="empty-wishlist">
          <i className="bi bi-heart"></i>
          <p>Your wishlist is empty</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Browse Books
          </button>
        </div>
      ) : (
        <>
          <p className="wishlist-count">
            You have {wishlistBooks.length} book{wishlistBooks.length !== 1 ? 's' : ''} in your wishlist
          </p>

          <div className="wishlist-grid">
            {wishlistBooks.map((book) => (
              <div key={book._id} className="wishlist-item">
                <BookCard book={book} />
                <button
                  className="btn btn-sm btn-danger mt-2 w-100"
                  onClick={() => removeFromWishlist(book._id)}
                >
                  Remove from Wishlist
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
