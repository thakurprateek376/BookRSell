import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book._id}`);
  };

  // Construct full image URL
  const getImageUrl = (image) => {
    if (!image) {
      console.log(`[BookCard] No image for ${book.title}`);
      return null;
    }
    if (image.startsWith('http')) {
      console.log(`[BookCard] Full URL image: ${image}`);
      return image; // Already a full URL
    }
    const fullUrl = `http://localhost:5000/${image}`;
    console.log(`[BookCard] Constructed URL for ${book.title}: ${fullUrl}`);
    return fullUrl; // Add backend base URL
  };

  const imageUrl = getImageUrl(book.image);

  return (
    <div className="card h-100 shadow-sm book-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {imageUrl && (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={book.title}
          style={{ height: '200px', objectFit: 'cover', backgroundColor: '#f0f0f0' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200?text=No+Image';
            e.target.style.height = '200px';
          }}
        />
      )}
      {!imageUrl && (
        <div
          className="card-img-top"
          style={{
            height: '200px',
            backgroundColor: '#e9ecef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
          }}
        >
          📚 No Image
        </div>
      )}
      <div className="card-body">
        <h6 className="card-title truncate">{book.title}</h6>
        <p className="card-text text-muted small">{book.author}</p>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="h5 mb-0 text-primary">₹{book.price}</span>
          <span className="badge bg-success">{book.condition}</span>
        </div>
        <p className="card-text small text-muted mb-0">
          <FaMapMarkerAlt /> {book.city}
        </p>
        <p className="card-text small text-muted mb-0">
          Category: {book.category}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
