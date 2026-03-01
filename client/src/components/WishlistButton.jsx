import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './WishlistButton.css';

const WishlistButton = ({ bookId }) => {
  const { token } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && bookId) {
      checkWishlist();
    }
  }, [bookId, token]);

  const checkWishlist = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/wishlist/check/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInWishlist(response.data.inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      alert('Please login to use wishlist');
      return;
    }

    setLoading(true);
    try {
      if (inWishlist) {
        await axios.delete(
          `http://localhost:5000/api/wishlist/remove/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInWishlist(false);
      } else {
        await axios.post(
          `http://localhost:5000/api/wishlist/add/${bookId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Error updating wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`wishlist-btn ${inWishlist ? 'in-wishlist' : ''}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <i className={`bi bi-heart${inWishlist ? '-fill' : ''}`}></i>
      {inWishlist ? ' Saved' : ' Save'}
    </button>
  );
};

export default WishlistButton;
