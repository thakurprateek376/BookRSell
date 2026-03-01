import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ReviewForm.css';

const ReviewForm = ({ bookId, onReviewAdded }) => {
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/reviews/create/${bookId}`,
        { rating: parseInt(rating), comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Review submitted successfully!');
      setRating(5);
      setComment('');
      if (onReviewAdded) {
        onReviewAdded(response.data.review);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error submitting review';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h4>Write a Review</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <input
                key={star}
                type="radio"
                id={`star${star}`}
                name="rating"
                value={star}
                checked={rating === star}
                onChange={() => setRating(star)}
              />
            ))}
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <label
                  key={star}
                  htmlFor={`star${star}`}
                  className={`star ${star <= rating ? 'active' : ''}`}
                >
                  ★
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this book..."
            rows="4"
            maxLength="500"
          />
          <small>{comment.length}/500 characters</small>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
