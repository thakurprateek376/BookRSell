import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewList.css';

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/reviews/book/${bookId}`
      );
      setReviews(response.data.reviews || []);
      setAverageRating(response.data.averageRating || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="reviews-container"><p>Loading reviews...</p></div>;
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h4>Reviews</h4>
        {reviews.length > 0 && (
          <div className="rating-summary">
            <div className="average-rating">
              <span className="rating-value">{averageRating.toFixed(1)}</span>
              <span className="out-of">/5</span>
            </div>
            <div className="rating-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</div>
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div>
                  <h6 className="reviewer-name">{review.reviewer?.name || 'Anonymous'}</h6>
                  {renderStars(review.rating)}
                </div>
                <small className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>

              {review.comment && <p className="review-comment">{review.comment}</p>}

              {review.helpful > 0 && (
                <small className="helpful-count">
                  <i className="bi bi-hand-thumbs-up"></i> {review.helpful} found this helpful
                </small>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
