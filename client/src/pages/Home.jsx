import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterSection from '../components/FilterSection';
import QuickFilterModal from '../components/QuickFilterModal';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import { bookAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickFilter, setShowQuickFilter] = useState(false);

  const categories = [
    { name: 'Text Books', icon: '📖', color: '#FF6B6B', emoji: '✏️' },
    { name: 'Competitive Books', icon: '🏆', color: '#4ECDC4', emoji: '🎯' },
    { name: 'Kids Books', icon: '🧒', color: '#FFE66D', emoji: '🎨' },
    { name: 'Fantasy', icon: '✨', color: '#A8E6CF', emoji: '🐉' },
    { name: 'Hindi Books', icon: '🌏', color: '#FF8B94', emoji: '📚' },
    { name: 'Used Books', icon: '♻️', color: '#95E1D3', emoji: '🔄' },
    { name: 'Popular New Books', icon: '⭐', color: '#F38181', emoji: '🆕' },
    { name: 'Rupa Publication', icon: '🏢', color: '#AA96DA', emoji: '📖' },
  ];

  // Get category from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters({ category: categoryFromUrl });
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, search, page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getBooks({
        ...filters,
        search,
        page,
        limit: 12,
      });
      setBooks(response.data.books);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleCategoryClick = (categoryName) => {
    setFilters({ category: categoryName });
    setPage(1);
  };

  return (
    <div className="home-container">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="home-header-section">
          <div className="header-content">
            <h1 className="header-title">📚 BookRsell</h1>
            <p className="header-subtitle">Your Gateway to Amazing Books</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Categories Grid - Only show on first page without filters */}
        {page === 1 && !search && !filters.category && (
          <div className="categories-section">
            <h2 className="section-title">📂 Explore by Category</h2>
            <div className="categories-grid">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="category-card playful"
                  style={{ '--card-color': cat.color }}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="category-icon">{cat.emoji}</div>
                  <h3 className="category-name">{cat.name}</h3>
                  <div className="category-hover">Explore →</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters & Books Section */}
        <div className="books-wrapper">
          {filters.category && (
            <div className="category-header">
              <h2 className="category-display">📚 {filters.category}</h2>
              <button 
                className="btn-clear-category" 
                onClick={() => setFilters({})}
              >
                ✕ Clear
              </button>
            </div>
          )}

          {/* Filter Toggle */}
          <button 
            className="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            ⚙️ {showFilters ? 'Hide' : 'Show'} Filters
          </button>

          {/* Quick Filters Button */}
          <button 
            className="quick-filter-btn"
            onClick={() => setShowQuickFilter(true)}
          >
            ⚡ Quick Filters
          </button>

          {/* Filter Section - Collapsible */}
          {showFilters && (
            <div className="filter-wrapper">
              <FilterSection onFilter={handleFilter} />
            </div>
          )}

          {/* Quick Filter Modal */}
          <QuickFilterModal 
            isOpen={showQuickFilter} 
            onClose={() => setShowQuickFilter(false)}
            onApply={handleFilter}
          />
        
        <div className="books-section">
          {loading ? (
            <Loader />
          ) : books.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No books found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="books-header">
                <p className="books-count">Found <strong>{books.length} books</strong></p>
              </div>
              <div className="books-grid">
                {books.map((book) => (
                  <div key={book._id} className="book-item">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="pagination-container" aria-label="Page navigation">
                  <ul className="pagination-list">
                    <li>
                      <button
                        className="page-btn"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        ← Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <li key={p}>
                        <button
                          className={`page-num ${page === p ? 'active' : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        className="page-btn"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next →
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
