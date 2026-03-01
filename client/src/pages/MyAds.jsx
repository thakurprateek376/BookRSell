import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookAPI } from '../services/api';
import Loader from '../components/Loader';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './MyAds.css';

const MyAds = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    fetchMyBooks();
  }, [token, navigate]);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getSellerBooks();
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to load your books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.deleteBook(id);
        alert('Book deleted successfully');
        setBooks(books.filter((book) => book._id !== id));
      } catch (error) {
        alert('Failed to delete book');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="myads-container">
      <div className="myads-content">
        <div className="myads-header">
          <h1 className="myads-title">My Ads</h1>
          <button className="myads-add-btn" onClick={() => navigate('/add-book')}>
            ➕ Add New Book
          </button>
        </div>

        {books.length === 0 ? (
          <div className="myads-empty">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">No Books Listed Yet</h3>
            <p className="empty-text">Start selling your books today!</p>
            <button className="empty-btn" onClick={() => navigate('/add-book')}>
              Add Your First Book
            </button>
          </div>
        ) : (
          <>
            <div className="myads-grid">
              {books.map((book) => (
                <div key={book._id} className="ad-card">
                  <div className="ad-image">📖</div>
                  <div className="ad-body">
                    <h3 className="ad-title">{book.title}</h3>
                    <div className="ad-price">₹{book.price}</div>
                    <div className="ad-meta">
                      <span>{book.author}</span>
                      <span>{book.category}</span>
                    </div>
                    <div className="ad-meta">
                      <span>📍 {book.city}</span>
                      <span className={`ad-status ${book.isActive ? 'status-active' : 'status-sold'}`}>
                        {book.isActive ? '✓ Active' : '✗ Inactive'}
                      </span>
                    </div>
                    <div className="ad-actions">
                      <button
                        className="ad-btn btn-edit"
                        onClick={() => navigate(`/edit-book/${book._id}`)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="ad-btn btn-delete"
                        onClick={() => handleDelete(book._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAds;
