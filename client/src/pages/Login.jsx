import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      startLoading('Logging in...');
      const response = await authAPI.login(formData);
      
      console.log('Login response:', response.data);
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid login response format');
      }

      // Use AuthContext to update global auth state
      login(response.data.user, response.data.token);
      
      console.log('Login successful, redirecting...');
      stopLoading();
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      stopLoading();
      
      // Handle different error types
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Login failed. Please try again.';
      
      setError(errorMessage);
      console.error('Error displayed:', errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4">
            <h2 className="mb-4">Login</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  border: 'none',
                  fontWeight: '600',
                }}
              >
                Login
              </button>
            </form>

            <p className="text-center">
              Don't have an account? <a href="/register">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
