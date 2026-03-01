import React, { useState } from 'react';
import './FilterSection.css';

const FilterSection = ({ onFilter }) => {
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

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
    });
    onFilter({
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="filter-section card mb-4">
      <div className="filter-container">
        <h5 className="filter-title">
          <i className="bi bi-funnel"></i> Filters
        </h5>

        <div className="filter-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select form-select-sm"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">City</label>
          <select
            name="city"
            className="form-select form-select-sm"
            value={filters.city}
            onChange={handleChange}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group price-group">
          <label className="form-label">Price Range (₹)</label>
          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              className="form-control form-control-sm"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              name="maxPrice"
              className="form-control form-control-sm"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
            />
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleFilter}
          >
            <i className="bi bi-search"></i> Apply
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-clockwise"></i> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
