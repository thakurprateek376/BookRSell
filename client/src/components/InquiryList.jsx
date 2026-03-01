import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import ChatBox from './ChatBox';
import './InquiryList.css';

const InquiryList = ({ userRole = 'buyer' }) => {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Default page size (not user-changeable for now)
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef(null);

  const fetchInquiries = useCallback(async (page = 1, retryAttempt = 0) => {
    try {
      setLoading(true);
      setError('');
      
      if (!token) {
        setError('Not authenticated. Please login again.');
        setLoading(false);
        return;
      }

      const endpoint =
        userRole === 'seller'
          ? 'http://localhost:5000/api/inquiries/seller'
          : 'http://localhost:5000/api/inquiries/buyer';

      const response = await axios.get(endpoint, {
        params: {
          page,
          limit: pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      });

      setInquiries(response.data.inquiries || []);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.pages);
      setTotalInquiries(response.data.pagination.total);
      setError('');
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      
      // Retry logic: retry up to 3 times with exponential backoff
      if (retryAttempt < 3 && (!error.response || error.response.status >= 500)) {
        const delayMs = Math.pow(2, retryAttempt) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Retrying in ${delayMs}ms (attempt ${retryAttempt + 1}/3)...`);
        
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchInquiries(page, retryAttempt + 1);
        }, delayMs);
        return;
      }

      // Handle different error types
      let errorMessage = 'Error loading inquiries. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view this.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Server may be slow. Please try again.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again in a moment.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [token, userRole, pageSize]);

  useEffect(() => {
    if (token) {
      fetchInquiries(1, 0);
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [token, userRole, fetchInquiries]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchInquiries(currentPage, 0);
  };

  const updateStatus = async (inquiryId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/inquiries/status/${inquiryId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchInquiries(currentPage);
      setStatusUpdate('Status updated successfully!');
      setTimeout(() => setStatusUpdate(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Error updating status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/inquiries/delete/${inquiryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchInquiries(currentPage);
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      setError(error.response?.data?.message || 'Error deleting inquiry');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleOpenChat = async (inquiry) => {
    try {
      const response = await chatAPI.getOrCreateConversation(inquiry.book._id, inquiry._id);
      setActiveConversation(response.data);
      setChatOpen(true);
    } catch (error) {
      console.error('Error opening chat:', error);
      setError(error.response?.data?.message || 'Error opening chat. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchInquiries(newPage, 0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="inquiries-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading inquiries...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="inquiries-container">
      <h4>{userRole === 'seller' ? 'Received Inquiries' : 'My Inquiries'}</h4>

      {error && (
        <div className="alert alert-danger error-alert">
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
            {retryCount > 0 && <span className="retry-info"> (Retry attempt {retryCount}/3)</span>}
          </div>
          <button 
            className="btn btn-sm btn-outline-danger retry-btn"
            onClick={handleRetry}
          >
            🔄 Try Again
          </button>
        </div>
      )}
      
      {statusUpdate && <div className="alert alert-success">{statusUpdate}</div>}

      {chatOpen && activeConversation && (
        <div style={{ marginBottom: '20px' }}>
          <ChatBox
            conversationId={activeConversation._id}
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}

      {totalInquiries > 0 && (
        <div className="inquiries-stats">
          <span className="stat-badge">Total: {totalInquiries}</span>
          <span className="stat-badge">Page {currentPage} of {totalPages}</span>
        </div>
      )}

      {inquiries.length === 0 && !error ? (
        <p className="no-inquiries">
          {userRole === 'seller'
            ? 'No inquiries received yet'
            : 'You have not sent any inquiries yet'}
        </p>
      ) : (
        <>
          <div className="inquiries-list">
            {inquiries.map((inquiry) => (
              <div key={inquiry._id} className={`inquiry-item status-${inquiry.status}`}>
                <div className="inquiry-main-info">
                  <div className="inquiry-title">
                    <h6>{inquiry.book?.title || 'Unknown Book'}</h6>
                    <span className={`status-badge status-${inquiry.status}`}>
                      {inquiry.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="inquiry-details">
                    <p>
                      <strong>{userRole === 'seller' ? 'From:' : 'To:'}</strong>{' '}
                      {userRole === 'seller'
                        ? inquiry.buyer?.name
                        : inquiry.seller?.name}
                    </p>
                    <p>
                      <strong>Offered Price:</strong> Rs. {inquiry.offeredPrice}
                    </p>
                    <p>
                      <strong>Message:</strong> {inquiry.message}
                    </p>
                    <small className="inquiry-date">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>

                <div className="inquiry-actions">
                  {userRole === 'seller' && inquiry.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => updateStatus(inquiry._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => updateStatus(inquiry._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {inquiry.status === 'accepted' && (
                    <>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleOpenChat(inquiry)}
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                        }}
                      >
                        💬 Chat
                      </button>
                      {userRole === 'seller' && (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => updateStatus(inquiry._id, 'sold')}
                        >
                          Mark as Sold
                        </button>
                      )}
                    </>
                  )}

                  {userRole === 'buyer' && inquiry.status === 'pending' && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteInquiry(inquiry._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                ← Previous
              </button>

              <div className="page-info">
                {loading ? (
                  <span className="loading-text">Loading page {currentPage}...</span>
                ) : (
                  <>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                      >
                        {page}
                      </button>
                    ))}
                  </>
                )}
              </div>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InquiryList;
