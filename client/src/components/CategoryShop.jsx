import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryShop.css';
import { FaStore, FaRecycle, FaTrophy, FaChild, FaBook as FaTextBook, FaWandMagicSparkles, FaLanguage } from 'react-icons/fa6';

const CategoryShop = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Text Books',
      icon: FaTextBook,
      description: 'Academic & educational books',
      color: 'primary',
      queryParam: 'Text Books'
    },
    {
      name: 'Competitive Books',
      description: 'Exam preparation & entrance',
      icon: FaTrophy,
      color: 'success',
      queryParam: 'Competitive Books'
    },
    {
      name: 'Kids Books',
      description: 'Children books & stories',
      icon: FaChild,
      color: 'warning',
      queryParam: 'Kids Books'
    },
    {
      name: 'Fantasy',
      description: 'Fantasy & adventure novels',
      icon: FaWandMagicSparkles,
      color: 'info',
      queryParam: 'Fantasy'
    },
    {
      name: 'Hindi Books',
      description: 'Hindi language books',
      icon: FaLanguage,
      color: 'danger',
      queryParam: 'Hindi Books'
    },
    {
      name: 'Used Books',
      description: 'Second-hand books',
      icon: FaRecycle,
      color: 'secondary',
      queryParam: 'Used Books'
    },
    {
      name: 'Popular New Books',
      description: 'Latest bestsellers',
      icon: FaTrophy,
      color: 'dark',
      queryParam: 'Popular New Books'
    },
    {
      name: 'Rupa Publication',
      description: 'Rupa & Co. publisher',
      icon: FaStore,
      color: 'primary',
      queryParam: 'Rupa Publication'
    },
  ];

  const handleCategoryClick = (category) => {
    navigate('/?category=' + encodeURIComponent(category));
    // Scroll to books section
    setTimeout(() => {
      document.querySelector('.books-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="category-shop-container">
      <div className="category-header">
        <h2>📚 Shop By Category</h2>
        <p className="category-subtitle">Browse our collection by category</p>
      </div>

      <div className="category-grid">
        {categories.map((cat, index) => {
          const IconComponent = cat.icon;
          return (
            <div
              key={index}
              className={`category-card category-${cat.color}`}
              onClick={() => handleCategoryClick(cat.queryParam)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCategoryClick(cat.queryParam);
              }}
            >
              <div className="category-icon">
                <IconComponent />
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-description">{cat.description}</p>
              <div className="category-footer">
                <span className="browse-btn">Browse →</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="category-features">
        <div className="feature-item">
          <span className="feature-icon">✓</span>
          <h4>Wide Selection</h4>
          <p>Browse thousands of books across all categories</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">✓</span>
          <h4>Best Prices</h4>
          <p>Affordable second-hand books from sellers near you</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">✓</span>
          <h4>Easy to Find</h4>
          <p>Quick filters and search to find exactly what you need</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryShop;
