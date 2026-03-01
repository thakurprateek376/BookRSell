import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { bookAPI } from '../services/api';
import './AddBook.css';

const AddBook = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    description: '',
    city: '',
    condition: 'Good',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

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
  const conditions = ['Like New', 'Very Good', 'Good', 'Fair'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.author || !formData.price || !formData.category || !formData.description || !formData.city) {
      setError('All fields are required');
      return;
    }

    try {
      startLoading('Uploading book details...');
      const form = new FormData();
      form.append('title', formData.title);
      form.append('author', formData.author);
      form.append('price', formData.price);
      form.append('category', formData.category);
      form.append('description', formData.description);
      form.append('city', formData.city);
      form.append('condition', formData.condition);
      if (image) {
        form.append('image', image);
      }

      await bookAPI.addBook(form);
      stopLoading();
      navigate('/my-ads');
    } catch (err) {
      stopLoading();
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <h2 className="mb-4">Add New Book</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Book Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter book title"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Condition</label>
                  <select
                    name="condition"
                    className="form-select"
                    value={formData.condition}
                    onChange={handleChange}
                  >
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the book condition, highlights, etc."
                  ></textarea>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Book Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      border: 'none',
                      fontWeight: '600',
                    }}
                  >
                    Add Book
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
