import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import InquiryList from '../components/InquiryList';
import './MyInquiries.css';

const MyInquiries = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('buyer');

  if (!user) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Please login to view your inquiries.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>My Inquiries</h2>
      
      <div className="inquiries-tabs">
        <button
          className={`tab-button ${activeTab === 'buyer' ? 'active' : ''}`}
          onClick={() => setActiveTab('buyer')}
        >
          <i className="bi bi-bag"></i> Books I'm Interested In
        </button>
        
        <button
          className={`tab-button ${activeTab === 'seller' ? 'active' : ''}`}
          onClick={() => setActiveTab('seller')}
        >
          <i className="bi bi-shop"></i> Inquiries Received
        </button>
      </div>

      <div className="inquiries-content">
        {activeTab === 'buyer' && (
          <InquiryList userRole="buyer" />
        )}
        {activeTab === 'seller' && (
          <InquiryList userRole="seller" />
        )}
      </div>
    </div>
  );
};

export default MyInquiries;
