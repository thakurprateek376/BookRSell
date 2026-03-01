import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check for OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        login(userData, token);
        setSuccess('Google registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Failed to process Google login');
      }
    }
  }, [navigate, login]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.city) {
      setError('Name, email, password, and city are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      startLoading('Creating your account...');
      const response = await authAPI.register(formData);
      
      // Use AuthContext to update global auth state
      login(response.data.user, response.data.token);
      
      stopLoading();
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      stopLoading();
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="card p-3 p-sm-4" style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 className="mb-2 text-center" style={{ color: '#1f2937', fontWeight: '700', fontSize: '1.75rem' }}>Create Account</h2>
            <p className="text-center mb-4" style={{ color: '#6b7280', fontSize: '0.95rem' }}>Join BookRsell community and start trading books</p>
            
            {error && (
              <div className="alert alert-danger" role="alert" style={{ borderLeft: '4px solid #ef4444', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success" role="alert" style={{ borderLeft: '4px solid #10b981', marginBottom: '16px' }}>
                {success}
              </div>
            )}
            
            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#1f2937',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '2px', backgroundColor: '#e5e7eb' }}></div>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '500' }}>OR</span>
              <div style={{ flex: 1, height: '2px', backgroundColor: '#e5e7eb' }}></div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: '600', color: '#1f2937' }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={{ borderRadius: '8px', padding: '10px 12px', border: '2px solid #e5e7eb' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: '600', color: '#1f2937' }}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  style={{ borderRadius: '8px', padding: '10px 12px', border: '2px solid #e5e7eb' }}
                />
                <small className="text-muted">Must be unique</small>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: '600', color: '#1f2937' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+923001234567 (optional)"
                  style={{ borderRadius: '8px', padding: '10px 12px', border: '2px solid #e5e7eb' }}
                />
                <small className="text-muted">Optional - For better account verification</small>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: '600', color: '#1f2937' }}>Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  style={{ borderRadius: '8px', padding: '10px 12px', border: '2px solid #e5e7eb' }}
                />
                <small className="text-muted">Minimum 6 characters required</small>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: '600', color: '#1f2937' }}>City *</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                  style={{ borderRadius: '8px', padding: '10px 12px', border: '2px solid #e5e7eb' }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: '600', color: '#1f2937' }}>Account Type *</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ borderRadius: '8px', padding: '10px 12px', border: '2px solid #e5e7eb' }}
                >
                  <option value="buyer">Buyer - Buy books</option>
                  <option value="seller">Seller - Buy & Sell books</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn w-100 mb-3"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
              >
                Create Account
              </button>
            </form>

            <hr style={{ color: '#e5e7eb' }} />

            <p className="text-center mb-0" style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Already have an account? <a href="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
