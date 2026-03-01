import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './InquiryForm.css';

const InquiryForm = ({ bookId, sellerId, sellerName, bookTitle, onInquirySent }) => {
  const { token, user } = useAuth();
  const [message, setMessage] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Please login to send an inquiry');
      return;
    }

    if (user?.id === sellerId) {
      setError('You cannot send inquiry for your own listing');
      return;
    }

    if (!message.trim()) {
      setError('Please write a message');
      return;
    }

    if (!offeredPrice || parseFloat(offeredPrice) <= 0) {
      setError('Please enter a valid offered price');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/inquiries/create/${bookId}`,
        { message, offeredPrice: parseFloat(offeredPrice) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Inquiry sent successfully!');
      setMessage('');
      setOfferedPrice('');
      if (onInquirySent) {
        onInquirySent(response.data.inquiry);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error sending inquiry';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inquiry-form-container">
      <h4>Interested? Send an Inquiry</h4>
      <p className="inquiry-subtitle">
        Contact the seller about <strong>{bookTitle}</strong>
      </p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${sellerName}, I'm interested in your book...`}
            rows="4"
            maxLength="500"
          />
          <small>{message.length}/500 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="offeredPrice">Your Offered Price</label>
          <div className="price-input-group">
            <span className="currency">Rs.</span>
            <input
              id="offeredPrice"
              type="number"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              placeholder="Enter your offer"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
