import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Loader from '../components/Loader';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
      setFormData({
        name: response.data.user.name,
        city: response.data.user.city,
        phone: response.data.user.phone,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.updateProfile(formData);
      setProfile(response.data.user);
      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <Loader />;
  if (!profile) return <div className="profile-container"><p>Profile not found</p></div>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2 className="profile-title">My Profile</h2>

        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <div className="profile-name">{profile.name}</div>
            <div className="profile-email">{profile.email}</div>
            <div className="profile-city">📍 {profile.city}</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Books Listed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Active Ads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Sold Books</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{profile.role}</div>
            <div className="stat-label">Role</div>
          </div>
        </div>

        {!editing ? (
          <div>
            <div className="profile-section">
              <h3 className="section-title">Account Details</h3>
              
              <div className="profile-form-group">
                <label>Phone</label>
                <input
                  type="text"
                  className="profile-input"
                  value={profile.phone || 'Not provided'}
                  disabled
                />
              </div>
            </div>

            <button
              className="btn-update"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="profile-section">
              <h3 className="section-title">Edit Profile</h3>
              
              <div className="profile-form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="profile-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  className="profile-input"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="profile-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-buttons">
              <button type="submit" className="btn-update">
                💾 Save Changes
              </button>
              <button
                type="button"
                className="btn-update"
                style={{ background: '#999' }}
                onClick={() => setEditing(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
