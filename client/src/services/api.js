import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Book APIs
export const bookAPI = {
  getBooks: (params) => api.get('/books', { params }),
  getBook: (id) => api.get(`/books/${id}`),
  addBook: (formData) =>
    api.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateBook: (id, formData) =>
    api.put(`/books/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getSellerBooks: () => api.get('/books/seller/myads'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getSellerInfo: (id) => api.get(`/users/${id}`),
};

// Chat APIs
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getOrCreateConversation: (bookId, inquiryId) =>
    api.post('/chat/conversation', { bookId, inquiryId }),
  getMessages: (conversationId) => api.get(`/chat/messages/${conversationId}`),
  sendMessage: (conversationId, message) =>
    api.post('/chat/message', { conversationId, message }),
  getUnreadCount: () => api.get('/chat/unread-count'),
  closeConversation: (conversationId) =>
    api.put(`/chat/conversation/${conversationId}/close`),
  deleteConversation: (conversationId) =>
    api.delete(`/chat/conversation/${conversationId}`),
};

export default api;
