import React, { useState } from 'react';
import './QuickFilterModal.css';

const QuickFilterModal = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });

  const categories = [
    'Text Books',
    'Competitive Books',
    'Kids Books',
    'Fantasy',
    'Hindi Books',
    'Used Books',
    'Popular New Books',
    'Rupa Publication',
    'Engineering',
    'Medical',
    'Science',
    'Arts',
    'Commerce',
    'Others'
  ];

  const cities = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Kolkata',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Chandigarh',
    'Indore'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="quick-filter-overlay" onClick={onClose}>
      <div className="quick-filter-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">⚡ Quick Filters</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Category */}
          <div className="filter-item">
            <label className="filter-label">📚 Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="filter-item">
            <label className="filter-label">📍 City</label>
            <select
              name="city"
              value={filters.city}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-item">
            <label className="filter-label">💰 Price Range (₹)</label>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="Min Price"
                className="price-input"
              />
              <span className="price-sep">to</span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="Max Price"
                className="price-input"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-reset" onClick={handleReset}>
            🔄 Reset
          </button>
          <button className="btn-apply" onClick={handleApply}>
            ✓ Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickFilterModal;
