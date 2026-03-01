import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import ChatBox from '../components/ChatBox';
import './Messages.css';

const Messages = () => {
  const { token, user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch conversations on load and auto-refresh
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setError('');
        const response = await chatAPI.getConversations();
        setConversations(response.data || []);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err.response?.data?.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchConversations();
      // Refresh conversations every 5 seconds (get new messages)
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleOpenChat = (conversation) => {
    setSelectedConversation(conversation);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedConversation(null);
  };

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(conversationId);
      await chatAPI.deleteConversation(conversationId);
      setConversations(conversations.filter(conv => conv._id !== conversationId));
      if (selectedConversation?._id === conversationId) {
        handleCloseChat();
      }
      setError('');
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError(err.response?.data?.message || 'Failed to delete conversation');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-page-title">
        <h2>💬 Messages</h2>
        <p className="subtitle">Your conversations with buyers and sellers</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="messages-layout">
        {/* Conversations List */}
        <div className="conversations-list-section">
          <h3>Conversations</h3>
          
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="no-conversations">
              <p>💭 No conversations yet</p>
              <small>Send an inquiry or accept one to start messaging</small>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conv) => {
                const otherUser =
                  conv.buyer._id === currentUser.id ? conv.seller : conv.buyer;
                return (
                  <div
                    key={conv._id}
                    className={`conversation-item ${
                      selectedConversation?._id === conv._id ? 'active' : ''
                    }`}
                    onClick={() => handleOpenChat(conv)}
                  >
                    <div className="conversation-info">
                      <h5>{otherUser.name}</h5>
                      <p className="book-title">
                        📖 {conv.book?.title || 'Unknown Book'}
                      </p>
                      <p className="last-message">
                        {conv.lastMessage
                          ? conv.lastMessage.substring(0, 40) + '...'
                          : 'No messages yet'}
                      </p>
                    </div>
                    <div className="conversation-actions">
                      <div className="conversation-status">
                        <span
                          className={`status-badge status-${conv.status}`}
                        >
                          {conv.status.toUpperCase()}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                      <button
                        className="btn-delete-chat"
                        onClick={(e) => handleDeleteConversation(conv._id, e)}
                        disabled={deleteLoading === conv._id}
                        title="Delete conversation"
                      >
                        {deleteLoading === conv._id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="chat-area-section">
          {chatOpen && selectedConversation ? (
            <>
              <div className="chat-header-bar">
                <h4>{selectedConversation.book?.title}</h4>
                <button onClick={handleCloseChat} className="btn-close">
                  ✕
                </button>
              </div>
              <ChatBox
                conversationId={selectedConversation._id}
                onClose={handleCloseChat}
                otherUser={
                  selectedConversation.buyer._id === currentUser.id
                    ? selectedConversation.seller
                    : selectedConversation.buyer
                }
              />
            </>
          ) : (
            <div className="no-chat-selected">
              <p>👈 Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
