import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookAPI, userAPI } from '../services/api';
import Loader from '../components/Loader';
import WishlistButton from '../components/WishlistButton';
import InquiryForm from '../components/InquiryForm';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getBook(id);
      setBook(response.data.book);
      
      // Fetch seller info
      if (response.data.book.seller) {
        const sellerResponse = await userAPI.getSellerInfo(response.data.book.seller._id);
        setSeller(sellerResponse.data.seller);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      alert('Book not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!book) return <div className="bookdetails-container"><p>Book not found</p></div>;

  // Get full image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    return `http://localhost:5000/${image}`;
  };

  const imageUrl = getImageUrl(book.image);

  return (
    <div className="bookdetails-container">
      <div className="bookdetails-content">
        
        <div className="bookdetails-grid">
          <div className="book-image-section">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={book.title}
                className="book-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x500?text=Book';
                }}
              />
            ) : (
              <div className="book-image">📚</div>
            )}
          </div>
          
          <div className="book-info-section">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">By {book.author}</p>
            
            <div className="book-rating">
              <div className="star">⭐⭐⭐⭐⭐</div>
              <span className="rating-text">4.5 (120 reviews)</span>
            </div>

            <div className="book-price">₹{book.price}</div>

            <div className="book-meta">
              <div className="meta-item">
                <span className="meta-label">Condition</span>
                <span className="meta-value">{book.condition}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{book.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Location</span>
                <span className="meta-value">📍 {book.city}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Listed</span>
                <span className="meta-value">2 days ago</span>
              </div>
            </div>

            <div className="book-actions">
              <button className="btn-action btn-buy">🛒 Buy Now</button>
              <button className="btn-action btn-wishlist">❤️ Wishlist</button>
            </div>

            {seller && (
              <div className="seller-section">
                <h5 className="seller-title">🏪 Seller Information</h5>
                <div className="seller-card">
                  <div className="seller-avatar">👤</div>
                  <div className="seller-info">
                    <div className="seller-name">{seller.name}</div>
                    <div className="seller-rating">⭐ 4.8 Rating • 245 Sales</div>
                  </div>
                  <button className="btn-contact">Contact</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="book-description">
          <h3 className="description-title">About This Book</h3>
          <p className="description-text">
            {book.description}
          </p>
        </div>

        <div className="book-specs">
          <h3 className="specs-title">📋 Book Details</h3>
          <div className="specs-grid">
            <div className="spec-item">
              <div className="spec-label">Publisher</div>
              <div className="spec-value">Penguin Books</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Pages</div>
              <div className="spec-value">320</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Language</div>
              <div className="spec-value">English</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Edition</div>
              <div className="spec-value">2024</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Binding</div>
              <div className="spec-value">Hardcover</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Condition</div>
              <div className="spec-value">{book.condition}</div>
            </div>
          </div>
        </div>

        {user?.id !== book.seller && (
          <InquiryForm
            bookId={book._id}
            sellerId={book.seller}
            sellerName={seller?.name || 'Seller'}
            bookTitle={book.title}
          />
        )}

        <div className="reviews-section">
          <ReviewList bookId={book._id} />
        </div>

        {user && user.id !== book.seller && (
          <ReviewForm bookId={book._id} />
        )}
      </div>
    </div>
  );
};

export default BookDetails;
