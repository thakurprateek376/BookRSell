import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { useLoading } from '../context/LoadingContext';

const ChatBox = ({ conversationId, onClose, otherUser }) => {
  const { user: currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const previousMessageCountRef = useRef(0);
  const userScrolledUpRef = useRef(false);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await chatAPI.getMessages(conversationId);
      setMessages(response.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [conversationId]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        setError('');
        
        await fetchMessages();
        
        if (!socketRef.current || !socketRef.current.connected) {
          socketRef.current = io('http://localhost:5000', {
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 3000,
            reconnectionAttempts: 10,
            transports: ['websocket', 'polling'],
          });

          socketRef.current.on('connect', () => {
            socketRef.current.emit('join-conversation', conversationId, currentUser.id);
          });

          socketRef.current.on('user-typing', (data) => {
            if (data.userId !== currentUser.id) {
              setOtherUserTyping(data.isTyping);
            }
          });

          socketRef.current.on('user-status-changed', (data) => {
            if (data.userId !== currentUser.id) {
              setOtherUserOnline(data.isOnline);
            }
          });

          socketRef.current.on('connect_error', (error) => {
            console.warn('Socket error:', error.message);
          });

          socketRef.current.on('disconnect', () => {
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    initializeChat();

    pollIntervalRef.current = setInterval(async () => {
      await fetchMessages();
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.emit('leave-conversation', conversationId, currentUser.id);
      }
    };
  }, [conversationId, currentUser.id, fetchMessages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;
      userScrolledUpRef.current = scrollHeight - scrollTop - clientHeight > 100;
    }
  };

  useEffect(() => {
    if (!userScrolledUpRef.current && messages.length > previousMessageCountRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
    
    previousMessageCountRef.current = messages.length;
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage;

    try {
      startLoading('Sending...');
      
      await chatAPI.sendMessage(conversationId, messageToSend);

      setNewMessage('');
      setIsTyping(false);
      
      await fetchMessages();
      
      userScrolledUpRef.current = false;

      stopLoading();
    } catch (err) {
      stopLoading();
      console.error('Send failed:', err);
      setError('Failed to send message');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (socketRef.current && !isTyping && value.trim()) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        conversationId,
        userId: currentUser.id,
        isTyping: true,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socketRef.current?.emit('typing', {
          conversationId,
          userId: currentUser.id,
          isTyping: false,
        });
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '500px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div>
          <h5 style={{ margin: 0, fontWeight: '600' }}>
            {otherUser?.name || 'Chat'}
          </h5>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            {otherUserTyping ? (
              <small style={{ opacity: 0.9 }}>✍️ Typing...</small>
            ) : otherUserOnline ? (
              <>
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'pulse 2s infinite'
                }} />
                <small style={{ opacity: 0.9 }}>Active Now</small>
              </>
            ) : (
              <>
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  display: 'inline-block',
                }} />
                <small style={{ opacity: 0.7 }}>Offline</small>
              </>
            )}
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '10px 15px',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>
            <p style={{ fontSize: '3rem', marginBottom: '10px' }}>💬</p>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender._id === currentUser.id;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 12px',
                    borderRadius: isOwn ? '12px 0px 12px 12px' : '0px 12px 12px 12px',
                    backgroundColor: isOwn ? '#2563eb' : '#e5e7eb',
                    color: isOwn ? 'white' : '#1f2937',
                    wordWrap: 'break-word',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{msg.message}</p>
                  <small
                    style={{
                      opacity: 0.7,
                      fontSize: '0.75rem',
                      display: 'block',
                      marginTop: '5px',
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </div>
              </div>
            );
          })
        )}
        {otherUserTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '0px 12px 12px 12px',
                backgroundColor: '#e5e7eb',
                color: '#1f2937',
              }}
            >
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'bounce 1.4s infinite',
                  }}
                />
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'bounce 1.4s infinite 0.2s',
                  }}
                />
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#999',
                    animation: 'bounce 1.4s infinite 0.4s',
                  }}
                />
              </div>
              <style>{`
                @keyframes bounce {
                  0%, 60%, 100% { transform: translateY(0); }
                  30% { transform: translateY(-10px); }
                }
              `}</style>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          display: 'flex',
          padding: '12px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#fff',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#1e40af')}
          onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
